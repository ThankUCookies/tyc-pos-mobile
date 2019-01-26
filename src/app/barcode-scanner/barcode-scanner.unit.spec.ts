import { BarcodeScannerPage } from './barcode-scanner.page';
import { HttpServiceMock } from '__mocks__/services/http.service';
import { IHttpService } from '../services/contracts/http.service';
import { Observable } from 'rxjs';
import { TRANSACTION_TYPES } from '__mocks__/data/transaction-types';

describe('Barcode Scanner Page', () => {
  let barcodeScannerPage: BarcodeScannerPage;
  let httpService: IHttpService;

  beforeEach(() => {
    httpService = new HttpServiceMock();
    barcodeScannerPage = new BarcodeScannerPage(httpService);
  });

  it('should call `get("transactions/types")` on httpService', () => {
    spyOn(httpService, 'get').and.callFake(() => {
      return new Observable();
    });

    barcodeScannerPage.ngOnInit();

    expect(httpService.get).toHaveBeenCalledWith('transactions/types');
  });
});
