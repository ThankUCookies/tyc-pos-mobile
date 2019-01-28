import { Observable } from 'rxjs';
import { IHttpService } from 'src/app/services/contracts/http.service';

import { TRANSACTION_TYPES } from '__mocks__/data/transaction-types';

export class HttpServiceMock implements IHttpService {
  async get(url: string): Promise<Observable<any>> {
    if (url === 'transactions/types') {
      return Promise.resolve(
        new Observable((observer) =>
          observer.next({ error: false, types: TRANSACTION_TYPES })
        )
      );
    }
  }

  async post(url: string, body: any): Promise<Observable<any>> {
    return Promise.resolve(new Observable());
  }
}
