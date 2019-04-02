import { Component, OnInit, ViewChild, AfterContentInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/implementations/auth.service';
import { ToastController, IonInput } from '@ionic/angular';
import { HttpErrorResponse } from '@angular/common/http';

import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html'
})
export class LoginPage implements OnInit {
  loginFormBuilder: FormBuilder;
  loginFormGroup: FormGroup;
  focusObservable: Observable<any>;

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

  onKeyPress(evt) {
    if(evt.keyCode == 13) {
      if(this.loginFormGroup.valid) {
        this.onBtnLoginClick();
      }
    }
  }
}
