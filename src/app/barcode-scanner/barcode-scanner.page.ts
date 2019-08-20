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
  currentSkus;
  localStorage = [];
  isInSyncProcess = false;

  constructor(
    private transactionService: TransactionService,
    private storage: Storage,
    private toastCtrl: ToastController,
    private networkService: Network,
    private tts: TextToSpeech
  ) {


    this.currentSkus = {
      transactions: []
    };
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
          this.showToast('The transaction was completed');

          this.currentSkus.eventId = this.eventsSelect.nativeElement.value;
          this.currentSkus.typeId = this.transactionTypesSelect.nativeElement.value;
          this.currentSkus.status = 'WAITING';         
        
          const today = new Date();
          today.setHours(today.getUTCHours() + 5);
          today.setMinutes(today.getUTCMinutes() + 30);

          const offlineEntries = await this.storage.get('transactions') || [];
          offlineEntries.push({
            eventId: this.currentSkus.eventId,
            typeId: this.currentSkus.typeId,
            transactions: this.currentSkus.transactions,
            status: 'WAITING',
            dateTime: today
          });
          await this.storage.set('transactions', offlineEntries);
          
          this.localStorage.push({
            eventId: this.currentSkus.eventId,
            dateTime: today,
            typeId: this.currentSkus.typeId,
            transactions: this.currentSkus.transactions,
            status: 'WAITING'
          });

          this.currentSkus = {
            transactions: []
          };

          return;
        }

        if (!this.eventsSelect.nativeElement.value) {
          this.showToast('Please select an event first');
          return;
        }

        this.skuCodes.readonly = true;
        
        this.currentSkus.transactions.push(skuCode);
        
        this.skuCodes.readonly = false;

        this.showToast('The item was scanned');
      }


      this.storage.get('transactions').then(totalOfflineEntries => {
        if(totalOfflineEntries)
        {
          this.totalOfflineEntries = totalOfflineEntries.length;
        }
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
    this.isInSyncProcess = true;
    const scans = await this.storage.get('transactions') || this.localStorage || [];
    const failedTransactions = [];

    for(let i = 0; i < scans.length; i++) {
      const skuCodes = scans[i].transactions;
      try {
        await (await this.transactionService.addSkus(
          scans[i].eventId,
          scans[i].typeId,
          scans[i].dateTime,
          skuCodes
        )).toPromise();
       
      } catch (e) {
        this.showToast(`Unable to sync a scan`);
        scans[i].status = 'FAILED';
        failedTransactions.push(scans[i]);
        return;
      }
    }

    await this.storage.remove('transactions');
    await this.storage.set('transactions', failedTransactions);
    this.showToast(`Sync complete`);
    this.isInSyncProcess = false;
  }

  onOfflineTransactionsClick() {
    this.storage.get('transactions').then(offlineEntries => {
      this.totalOfflineEntries = (offlineEntries || []).length;
      this.showToast(`You have ${this.totalOfflineEntries} to be synced`);
    });  
  }
}
