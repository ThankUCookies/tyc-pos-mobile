import { HttpService } from './http.service';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private httpService: HttpService,
    private tokenService: TokenService,
    private jwtHelperService: JwtHelperService
  ) {}

  public authenticate(userName: string, password: string) {
    return new Promise((resolve, reject) => {
      this.httpService
        .post('auth/login', { userName, password })
        .toPromise()
        .then((res: any) => {
          this.tokenService.setToken(res.token);

          resolve(true);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  public async getUserName() {
    return this.jwtHelperService.decodeToken(
      await this.tokenService.getToken()
    );
  }

  public async isLoggedIn() {
    const token: string = await this.tokenService.getToken();

    if (token && token.length > 0) {
      return !this.jwtHelperService.isTokenExpired(token);
    } else {
      return false;
    }
  }

  public logout() {
    this.tokenService.removeToken();
  }
}
