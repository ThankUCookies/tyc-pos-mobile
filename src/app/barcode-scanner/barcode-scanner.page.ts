import {
  Component,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  OnInit,
  Inject,
  AfterContentInit
} from '@angular/core';

import { IonTextarea } from '@ionic/angular';
import { Subscription } from 'rxjs';
import {
  HttpServiceToken,
  IHttpService
} from '../services/contracts/http.service';

@Component({
  templateUrl: './barcode-scanner.page.html'
})
export class BarcodeScannerPage implements OnInit, AfterContentInit, OnDestroy {
  @ViewChild('barcodes')
  barcodes: IonTextarea;
  focusObservable: Subscription;
  transactionTypes: any;
  private httpService: IHttpService;

  constructor(@Inject(HttpServiceToken) httpService) {
    this.httpService = httpService;
  }

  ngOnInit() {
    this.httpService.get('transactions/types').subscribe((response) => {
      if (!response.error) {
        this.transactionTypes = response.types;
      }
    });
  }

  ngAfterContentInit() {
    this.barcodes.autofocus = true;

    this.focusObservable = this.barcodes.ionBlur.subscribe(() => {
      this.barcodes.setFocus();
    });
  }

  ngOnDestroy() {
    this.focusObservable.unsubscribe();
  }
}
