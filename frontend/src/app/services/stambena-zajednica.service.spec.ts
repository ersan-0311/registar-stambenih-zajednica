import { TestBed } from '@angular/core/testing';

import { StambenaZajednicaService } from './stambena-zajednica.service';

describe('StambenaZajednicaService', () => {
  let service: StambenaZajednicaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StambenaZajednicaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
