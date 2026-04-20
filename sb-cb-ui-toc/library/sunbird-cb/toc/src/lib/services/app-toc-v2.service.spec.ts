import { TestBed } from '@angular/core/testing';

import { AppTocV2Service } from './app-toc-v2.service';

describe('AppTocV2Service', () => {
  let service: AppTocV2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppTocV2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
