import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/implementations/auth.service';
import { ToastController } from '@ionic/angular';
import { HttpErrorResponse } from '@angular/common/http';

import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html'
})
export class LoginPage implements OnInit {
  loginFormBuilder: FormBuilder;
  loginFormGroup: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  public ngOnInit() {
    this.loginFormBuilder = new FormBuilder();
    this.loginFormGroup = this.loginFormBuilder.group({
      userName: ['', [Validators.required]]
    });
  }

  public onBtnLoginClick() {
    const userName: string = this.loginFormGroup.get('userName').value;

    this.authService
      .authenticate(userName)
      .then(() => {
        this.loginFormGroup.reset();
        this.router.navigate(['/scan-barcode']);
      })
      .catch(async (err: HttpErrorResponse) => {
        if (err.status === 401) {
          const toast = await this.toastCtrl.create({
            animated: true,
            message: 'Your username incorrect!',
            duration: 3000
          });

          toast.present();
          this.loginFormGroup.reset();
        } else {
          const toast = await this.toastCtrl.create({
            animated: true,
            message: 'Something went wrong, please try again later!',
            duration: 3000
          });

          toast.present();
        }
      });
  }
}
