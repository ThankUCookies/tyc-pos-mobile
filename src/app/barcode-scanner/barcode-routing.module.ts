import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BarcodeScannerPage } from './barcode-scanner.page';

const routes: Routes = [
  {
    path: '',
    component: BarcodeScannerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)]
})
export class BarcodeScannerRoutingModule {}
