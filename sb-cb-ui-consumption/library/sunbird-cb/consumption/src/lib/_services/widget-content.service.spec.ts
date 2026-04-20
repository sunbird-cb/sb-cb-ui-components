import { TestBed } from '@angular/core/testing';

import { WidgetContentLibService } from './widget-content-lib.service';

describe('WidgetContentLibService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WidgetContentLibService = TestBed.get(WidgetContentLibService);
    expect(service).toBeTruthy();
  });
});
