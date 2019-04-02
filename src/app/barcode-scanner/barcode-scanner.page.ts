import {
  Component,
  ViewChild,
  OnDestroy,
  OnInit,
  AfterContentInit,
  ElementRef
} from '@angular/core';

import { IonTextarea, IonSelect, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { TransactionType } from '../models/transaction-type';
import { Event } from '../models/event';

import { Storage } from '@ionic/storage';
import { TransactionService } from '../services/implementations/transaction.service';

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

  constructor(private transactionService: TransactionService, private storage: Storage, private toastCtrl: ToastController) {
    this.currentTransactionIdKey = 'currentTransactionId';
  }

  async ngOnInit() {
    (await this.transactionService.getTypes()).subscribe((response: any) => {
      if (!response.error) {
        this.transactionTypes = response.types;
      }
    });

    (await this.transactionService.getEvents()).subscribe((response: any) => {
      if (!response.error) {
        this.events = response.events.filter(event => event.status == 'OPEN')
      }
    });

    this.currentTransactionId = await this.storage.get(this.currentTransactionIdKey);
  }

  ngAfterContentInit() {
    this.barcodes.autofocus = true;

    this.focusObservable = this.barcodes.ionBlur.subscribe(() => {
      this.barcodes.setFocus();
    });
  }

  async onKeyPress(evt) {
    if(evt.keyCode == 13) {
      const skuCode = this.getLastSkuCode();
      if(skuCode) {
        if(skuCode == 'AAA0000') {
          this.skuCodes.value = "";
          await this.storage.remove(this.currentTransactionIdKey);
          this.currentTransactionId = null;
          this.showToast('The transaction was completed');
       
          return;
        }

        if(!await this.storage.get(this.currentTransactionIdKey)) {
          try {
            if(!this.eventsSelect.nativeElement.value) {
              this.showToast('Please select an event first');
              return;
            }

            this.skuCodes.readonly = true;

            const response: any = await (await this.transactionService.createTransaction(this.eventsSelect.nativeElement.value, this.transactionTypesSelect.nativeElement.value))
            .toPromise();

            await this.storage.set(this.currentTransactionIdKey, response.id);
            this.currentTransactionId = response.id;
            
            this.skuCodes.readonly = false;
          }
          catch(e) {
            this.showToast(`Unable to create a new transaction`);

            return;
          }
        }

        this.skuCodes.readonly = true;
        const currentTransaction = await this.storage.get(this.currentTransactionIdKey);

        try {
          await (await this.transactionService.addSku(currentTransaction, skuCode)).toPromise();
          this.skuCodes.readonly = false;
        }
        catch(e) {
          this.showToast(`Unable to add a sku entry`);

          return;
        }

        this.showToast('The item was scanned');
      }
    }
  }

  private getLastSkuCode() {
    const skuCodes = this.skuCodes.value.split('\n');

    if(skuCodes.length > 0) {
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
  }
}
