import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private httpClient: HttpClient) {}

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
}
