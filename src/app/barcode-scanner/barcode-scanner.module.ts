import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { BarcodeScannerRoutingModule } from './barcode-routing.module';

import { BarcodeScannerPage } from './barcode-scanner.page';

import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

@NgModule({
  imports: [CommonModule, IonicModule, BarcodeScannerRoutingModule],
  declarations: [BarcodeScannerPage],
  providers: [BarcodeScanner]
})
export class BarcodeScannerModule {}
