import { TestBed } from '@angular/core/testing';

import { MicrositeV3Service } from './microsite-v3.service';

describe('MicrositeV3Service', () => {
  let service: MicrositeV3Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MicrositeV3Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
