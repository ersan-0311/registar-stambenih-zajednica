import { TestBed } from '@angular/core/testing';

import { OmiljeniService } from './omiljeni.service';

describe('OmiljeniService', () => {
  let service: OmiljeniService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OmiljeniService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
