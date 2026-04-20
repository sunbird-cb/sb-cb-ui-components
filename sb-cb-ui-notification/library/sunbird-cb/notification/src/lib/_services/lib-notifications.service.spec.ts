import { TestBed } from '@angular/core/testing';

import { LibNotificationsService } from './lib-notifications.service';

describe('LibNotificationsService', () => {
  let service: LibNotificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LibNotificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
