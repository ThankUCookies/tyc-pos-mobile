import { Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';

export interface IHttpService {
  post(url: string, body: any): Promise<Observable<any>>;
  get(url: string): Promise<Observable<any>>;
}

export const HttpServiceToken = new InjectionToken<IHttpService>('HttpService');
