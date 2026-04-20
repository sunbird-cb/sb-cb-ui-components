import { TestBed } from '@angular/core/testing';

import { UserEnrollCommunityService } from './user-enroll-community.service';

describe('UserEnrollCommunityService', () => {
  let service: UserEnrollCommunityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserEnrollCommunityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
