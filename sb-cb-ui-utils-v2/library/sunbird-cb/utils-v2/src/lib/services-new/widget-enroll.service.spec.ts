import { TestBed } from '@angular/core/testing';

import { WidgetEnrollService } from './widget-enroll.service';

describe('WidgetEnrollService', () => {
  let service: WidgetEnrollService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WidgetEnrollService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
