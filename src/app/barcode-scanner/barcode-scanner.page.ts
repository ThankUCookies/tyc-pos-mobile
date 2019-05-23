import {
  Component,
  ViewChild,
  OnDestroy,
  OnInit,
  AfterContentInit,
  ElementRef
} from '@angular/core';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';

import { IonTextarea, IonSelect, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { TransactionType } from '../models/transaction-type';
import { Event } from '../models/event';

import { Storage } from '@ionic/storage';
import { TransactionService } from '../services/implementations/transaction.service';
import { Network } from '@ionic-native/network/ngx';

@Component({
  templateUrl: './barcode-scanner.page.html'
})
export class BarcodeScannerPage implements OnInit, AfterContentInit, OnDestroy {
  @ViewChild('barcodes')
  barcodes: IonTextarea;
  @ViewChild('skuCodes')
  skuCodes: IonTextarea;
  @ViewChild('transactionTypesSelect')
  transactionTypesSelect: ElementRef;
  @ViewChild('eventsSelect')
  eventsSelect: ElementRef;
  focusObservable: Subscription;
  transactionTypes: Array<TransactionType>;
  events: Array<Event>;
  currentTransactionId: string;
  currentTransactionIdKey: string;
  isOnline: boolean = true;
  totalOfflineEntries: number = 0;

  constructor(
    private transactionService: TransactionService,
    private storage: Storage,
    private toastCtrl: ToastController,
    private networkService: Network,
    private tts: TextToSpeech
  ) {
    this.currentTransactionIdKey = 'currentTransactionId';

    this.storage.get('transactions').then(totalOfflineEntries => {
      this.totalOfflineEntries = totalOfflineEntries;
    });

    this.networkService.onDisconnect().subscribe(() => {
      this.isOnline = false;
      this.showToast('You are offline!');
    });

    this.networkService.onConnect().subscribe(() => {
      this.isOnline = true;
      this.showToast('You are online!');
    })
  }

  async ngOnInit() {
    if(this.isOnline) {
      (await this.transactionService.getTypes()).subscribe((response: any) => {
        if (!response.error) {
          this.transactionTypes = response.types;
          this.storage.set('types', response.types);
        }
      });
  
      (await this.transactionService.getEvents()).subscribe((response: any) => {
        if (!response.error) {
          this.events = response.events.filter((event) => event.status == 'OPEN');
          this.storage.set('events', response.events.filter((event) => event.status == 'OPEN'));
        }
      });
    }

    this.storage.get('types').then
      (types => {
        this.transactionTypes = types;
      });
      this.storage.get('events').then(events => {
        this.events = events;
      });     
    this.currentTransactionId = await this.storage.get(
      this.currentTransactionIdKey
    );
  }

  ngAfterContentInit() {
    this.barcodes.autofocus = true;

    this.focusObservable = this.barcodes.ionBlur.subscribe(() => {
      this.barcodes.setFocus();
    });
  }

  async onKeyPress(evt) {
    if (evt.keyCode == 13) {
      const skuCode = this.getLastSkuCode();
      if (skuCode) {
        if (skuCode.startsWith('AAA0000')) {
          this.skuCodes.value = '';
          await this.storage.remove(this.currentTransactionIdKey);
          this.currentTransactionId = null;
          this.showToast('The transaction was completed');

          if(!this.isOnline) {
            const offlineEntries = await this.storage.get('transactions') || [];
            offlineEntries.push({
              skuCode
            });
            await this.storage.set('transactions', offlineEntries);
          }

          return;
        }

        if (!(await this.storage.get(this.currentTransactionIdKey))) {
          try {
            if (!this.eventsSelect.nativeElement.value) {
              this.showToast('Please select an event first');
              return;
            }

            this.skuCodes.readonly = true;

            if(this.isOnline) {
              const response: any = await (await this.transactionService.createTransaction(
                this.eventsSelect.nativeElement.value,
                this.transactionTypesSelect.nativeElement.value
              )).toPromise();

              await this.storage.set(this.currentTransactionIdKey, response.id);
              this.currentTransactionId = response.id;
            }
            
            this.skuCodes.readonly = false;
          } catch (e) {
            this.showToast(`Unable to create a new transaction`);

            return;
          }
        }

        this.skuCodes.readonly = true;
        const currentTransaction = await this.storage.get(
          this.currentTransactionIdKey
        );

        try {
          if(this.isOnline) {
            await (await this.transactionService.addSku(
              currentTransaction,
              skuCode
            )).toPromise();
          }
          else {
            const offlineEntries = await this.storage.get('transactions') || [];
            offlineEntries.push({
              skuCode,
              event: this.eventsSelect.nativeElement.value,
              type: this.transactionTypesSelect.nativeElement.value,
              status: 'WAITING'
            });
            await this.storage.set('transactions', offlineEntries);
          }
         
          this.skuCodes.readonly = false;
        } catch (e) {
          this.showToast(`Unable to add a sku entry`);

          return;
        }

        this.showToast('The item was scanned');
      }

      this.storage.get('transactions').then(totalOfflineEntries => {
        this.totalOfflineEntries = totalOfflineEntries.length;
      });
    }
  }

  private getLastSkuCode() {
    const skuCodes = this.skuCodes.value.split('\n');

    if (skuCodes.length > 0) {
      return skuCodes[skuCodes.length - 1];
    }
  }

  ngOnDestroy() {
    this.focusObservable.unsubscribe();
  }

  private async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      animated: true,
      message: message,
      duration: 1000
    });
    toast.present();
    this.tts.stop();
    this.tts.speak(message);
  }

  async onBtnSyncClick() {
    if(!this.isOnline) {
      this.showToast('You need to be online to sync!');

      return;
    }
    const transactions = await this.storage.get('transactions') || [];
    const failedTransactions = [];

    for(let i = 0; i < transactions.length; i++) {
      const skuCode = transactions[i].skuCode;
      if (skuCode) {
        if (skuCode.startsWith('AAA0000')) {
          await this.storage.remove(this.currentTransactionIdKey);
        }
        else {
          if (!(await this.storage.get(this.currentTransactionIdKey)) && !transactions[i].transactionId) {
            try {
                const response: any = await (await this.transactionService.createTransaction(
                  transactions[i].event,
                  transactions[i].type
                )).toPromise();
    
                await this.storage.set(this.currentTransactionIdKey, response.id);
              } catch (e) {
                this.showToast(`Unable to create a new transaction`);
                failedTransactions.push({ ...transactions[i], status: 'FAILED'});
    
                return;
              }
          }
  
          const currentTransaction = await this.storage.get(
            this.currentTransactionIdKey
          );
  
          try {
            await (await this.transactionService.addSku(
              currentTransaction,
              transactions[i].skuCode
            )).toPromise();
           
          } catch (e) {
            this.showToast(`Unable to add a sku entry`);
            failedTransactions.push({ ...transactions[i], status: 'FAILED', transactionId: currentTransaction});
  
            return;
          }
        }
      }
    }

    await this.storage.remove('transactions');
    await this.storage.set('transactions', failedTransactions);
    this.showToast(`Sync complete`);
  }

  onOfflineTransactionsClick() {
    this.storage.get('transactions').then(offlineEntries => {
      this.totalOfflineEntries = (offlineEntries || []).length;
      this.showToast(`You have ${this.totalOfflineEntries} to be synced`);
    });  
  }
}
