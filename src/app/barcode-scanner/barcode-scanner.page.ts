import { Component } from '@angular/core';

import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ToastController } from '@ionic/angular';

@Component({
  templateUrl: './barcode-scanner.page.html'
})
export class BarcodeScannerPage {
  barcodes: string[];
  eofBarcode: string;

  constructor(
    private barcodeScanner: BarcodeScanner,
    private toastCtrl: ToastController
  ) {
    this.barcodes = [];
    this.eofBarcode = 'eoc';
  }

  public onContentClick() {
    this.barcodeScanner
      .scan({
        showFlipCameraButton: true,
        showTorchButton: true
      })
      .then(async (barcode) => {
        if (barcode.cancelled) {
          const toast = await this.toastCtrl.create({
            message: 'You cancelled the barcode scan!',
            duration: 3000,
            animated: true
          });

          toast.present();
        } else {
          this.barcodes.push(barcode.text);
        }
      })
      .catch(async (err) => {
        const toast = await this.toastCtrl.create({
          message: 'Error scanning the barcode, please try again!',
          duration: 3000,
          animated: true
        });

        toast.present();
      });
  }
}
