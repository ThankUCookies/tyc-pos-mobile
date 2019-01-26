import { Observable } from 'rxjs';
import { IHttpService } from 'src/app/services/contracts/http.service';

import { TRANSACTION_TYPES } from '__mocks__/data/transaction-types';

export class HttpServiceMock implements IHttpService {
  get(url: string): Observable<any> {
    if (url === 'transactions/types') {
      return new Observable((observer) =>
        observer.next({ error: false, types: TRANSACTION_TYPES })
      );
    }
  }

  post(url: string, body: any): Observable<any> {
    return new Observable();
  }
}
