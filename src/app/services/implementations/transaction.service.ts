import { Injectable, Inject } from '@angular/core';
import { HttpService } from './http.service';
import { HttpServiceToken } from '../contracts/http.service';
import { Network } from '@ionic-native/network/ngx';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private httpService: HttpService;

  constructor(@Inject(HttpServiceToken) httpService) {
    this.httpService = httpService;
  }

  public getEvents() {
    return this.httpService.get('transactions/events');
  }

  public getTypes() {
    return this.httpService.get('transactions/types');
  }

  public createTransaction(eventId: string, typeId: string) {
    return this.httpService.post('transactions/create', { typeId, eventId });
  }

  public addSku(transactionId: string, skuCode: string) {
    return this.httpService.post(`transactions/${transactionId}/add-sku`, {
      skuCode: skuCode
    });
  }

  public addSkus(eventId: string, typeId: string, dateTime: Date, skuCodes: string[]) {
    return this.httpService.post(`transactions/add-skus`, {
      eventId,
      typeId,
      dateTime,
      skuCodes
    });
  }
}
