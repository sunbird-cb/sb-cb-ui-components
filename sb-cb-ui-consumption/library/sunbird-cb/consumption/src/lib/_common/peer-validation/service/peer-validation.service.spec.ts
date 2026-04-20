import { TestBed } from '@angular/core/testing';

import { PeerValidationService } from './peer-validation.service';

describe('PeerValidationService', () => {
  let service: PeerValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PeerValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
