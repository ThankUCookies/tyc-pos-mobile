import { Component, OnInit } from '@angular/core';

import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

@Component({
  templateUrl: './barcode-scanner.page.html'
})
export class BarcodeScannerPage implements OnInit {
  constructor(private barcodeScanner: BarcodeScanner) {}

  ngOnInit() {
    this.barcodeScanner.scan().then((result) => {
      console.log(result);
    });
  }
}
