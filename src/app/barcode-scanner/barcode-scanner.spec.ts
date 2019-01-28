import { BarcodeScannerPage } from './barcode-scanner.page';
import { async } from '@angular/core/testing';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { HttpServiceToken } from '../services/contracts/http.service';
import { HttpServiceMock } from '__mocks__/services/http.service';
import { TRANSACTION_TYPES } from '__mocks__/data/transaction-types';

import { By } from '@angular/platform-browser';

describe('Barcode Scanner Page', () => {
  let fixture: ComponentFixture<BarcodeScannerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, IonicModule],
      declarations: [BarcodeScannerPage],
      providers: [
        {
          provide: HttpServiceToken,
          useClass: HttpServiceMock
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BarcodeScannerPage);
  }));

  describe('Transaction types', () => {
    it('should render the transaction types properly', async () => {
      await fixture.componentInstance.ngOnInit();

      fixture.detectChanges();

      const transactionTypesSelect = fixture.debugElement.query(
        By.css('#transaction-types')
      );
      const transactionTypesOption = transactionTypesSelect.queryAll(
        By.css('.transaction-type')
      );

      expect(transactionTypesOption.length).toBeGreaterThan(0);
      transactionTypesOption.forEach((transactionTypeOption, index) => {
        expect(
          transactionTypeOption.nativeElement.getAttribute('ng-reflect-value')
        ).toBe(TRANSACTION_TYPES[index].id);
        expect(transactionTypeOption.nativeElement.innerText).toBe(
          TRANSACTION_TYPES[index].name
        );
      });
    });
  });
});
