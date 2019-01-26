import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { IHttpService } from '../contracts/http.service';
import { Inject } from '@angular/core';

export class HttpService implements IHttpService {
  private httpClient: HttpClient;

  constructor(@Inject(HttpClient) httpClient) {
    this.httpClient = httpClient;
  }

  private getUrl(url: string) {
    return `${environment.serverUrl}/${url}`;
  }

  private getHeaders() {
    const headers = new HttpHeaders();

    headers.append('Content-Type', 'application/json');

    return headers;
  }

  public post(url: string, body: any) {
    return this.httpClient.post(this.getUrl(url), body, {
      headers: this.getHeaders()
    });
  }

  public get(url: string) {
    return this.httpClient.get(this.getUrl(url), {
      headers: this.getHeaders()
    });
  }
}
