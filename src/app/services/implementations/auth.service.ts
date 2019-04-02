import { Injectable, EventEmitter, Inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenService } from './token.service';
import { IHttpService, HttpServiceToken } from '../contracts/http.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authStatusEmitter: EventEmitter<boolean>;
  private httpService: IHttpService;

  constructor(
    @Inject(HttpServiceToken) httpService,
    private tokenService: TokenService,
    private jwtHelperService: JwtHelperService
  ) {
    this.httpService = httpService;
    this.authStatusEmitter = new EventEmitter<boolean>();
  }

  public authenticate(userName: string) {
    return new Promise(async (resolve, reject) => {
      (await this.httpService.post('auth/login', { userName }))
        .toPromise()
        .then((res: any) => {
          this.tokenService.setToken(res.token);

          this.authStatusEmitter.emit(true);
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

  public onAuthStatusChange() {
    return this.authStatusEmitter;
  }

  public async logout() {
    await this.tokenService.removeToken();
    this.authStatusEmitter.emit(false);
  }
}
