import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  tokenKey = 'token';

  constructor(private storage: Storage) {}

  public setToken(token) {
    this.storage.set(this.tokenKey, token);
  }

  public getToken() {
    return this.storage.get(this.tokenKey);
  }

  public removeToken() {
    this.storage.remove(this.tokenKey);
  }
}
