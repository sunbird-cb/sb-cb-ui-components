import { TestBed } from '@angular/core/testing';

import { DomainConfService } from './domain-conf.service';

describe('DomainConfService', () => {
  let service: DomainConfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DomainConfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
