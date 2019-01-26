import { Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';

export interface IHttpService {
  post(url: string, body: any): Observable<any>;
  get(url: string): Observable<any>;
}

export const HttpServiceToken = new InjectionToken<IHttpService>('HttpService');
