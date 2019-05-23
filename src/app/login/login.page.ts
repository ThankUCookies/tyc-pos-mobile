import { Component, OnInit, ViewChild, AfterContentInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/implementations/auth.service';
import { ToastController, IonInput } from '@ionic/angular';
import { HttpErrorResponse } from '@angular/common/http';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';

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
    private toastCtrl: ToastController,
    private tts: TextToSpeech
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
          this.showToast('Your username incorrect!');

          this.loginFormGroup.reset();
        } else {
          this.showToast('Something went wrong, please try again later!');
        }
      });
  }

  private async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      animated: true,
      message: message,
      duration: 1000
    });
    toast.present();
    this.tts.stop();
    this.tts.speak(message);
  }

  onKeyPress(evt) {
    if (evt.keyCode == 13) {
      if (this.loginFormGroup.valid) {
        this.onBtnLoginClick();
      }
    }
  }
}
