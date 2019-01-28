import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { IHttpService } from '../contracts/http.service';
import { Inject } from '@angular/core';

import { TokenService } from './token.service';

export class HttpService implements IHttpService {
  private httpClient: HttpClient;

  constructor(
    @Inject(HttpClient) httpClient,
    private tokenService: TokenService
  ) {
    this.httpClient = httpClient;
  }

  private getUrl(url: string) {
    return `${environment.serverUrl}/${url}`;
  }

  private async getHeaders() {
    let headers = new HttpHeaders();

    headers = headers
      .append('Content-Type', 'application/json')
      .append('Authorization', `Bearer ${await this.tokenService.getToken()}`);

    return headers;
  }

  public async post(url: string, body: any) {
    return this.httpClient.post(this.getUrl(url), body, {
      headers: await this.getHeaders()
    });
  }

  public async get(url: string) {
    return this.httpClient.get(this.getUrl(url), {
      headers: await this.getHeaders()
    });
  }
}
