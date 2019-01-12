import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import { HttpService } from '../components/services/http.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html'
})
export class LoginPage implements OnInit {
  loginFormBuilder: FormBuilder;
  loginFormGroup: FormGroup;

  constructor(private httpService: HttpService) {}

  ngOnInit() {
    this.loginFormBuilder = new FormBuilder();
    this.loginFormGroup = this.loginFormBuilder.group({
      userName: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onBtnLoginClick() {
    this.httpService
      .post('auth/login', {
        userName: this.loginFormGroup.get('userName').value,
        password: this.loginFormGroup.get('password').value
      })
      .subscribe((res) => {
        console.log(res);
      });
  }
}
