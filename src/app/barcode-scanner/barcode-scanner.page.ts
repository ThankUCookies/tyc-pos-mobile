import { Component, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';

import { IonTextarea } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './barcode-scanner.page.html'
})
export class BarcodeScannerPage implements AfterViewInit, OnDestroy {
  @ViewChild('barcodes')
  barcodes: IonTextarea;
  focsObservable: Subscription;

  ngAfterViewInit() {
    this.barcodes.setFocus();

    this.focsObservable = this.barcodes.ionBlur.subscribe(() => {
      this.barcodes.setFocus();
    });
  }

  ngOnDestroy() {
    this.focsObservable.unsubscribe();
  }
}
