import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  {
    path: 'scan-barcode',
    loadChildren:
      './barcode-scanner/barcode-scanner.module#BarcodeScannerModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
