import { TestBed } from '@angular/core/testing';

import { PostCreateHelperService } from './post-create-helper.service';

describe('PostCreateHelperService', () => {
  let service: PostCreateHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostCreateHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
