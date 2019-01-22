import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { BarcodeScannerRoutingModule } from './barcode-routing.module';

import { BarcodeScannerPage } from './barcode-scanner.page';

@NgModule({
  imports: [CommonModule, IonicModule, BarcodeScannerRoutingModule],
  declarations: [BarcodeScannerPage]
})
export class BarcodeScannerModule {}
