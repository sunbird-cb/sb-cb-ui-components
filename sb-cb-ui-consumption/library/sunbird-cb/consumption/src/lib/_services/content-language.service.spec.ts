import { TestBed } from '@angular/core/testing';

import { ContentLanguageService } from './content-language.service';

describe('ContentLanguageService', () => {
  let service: ContentLanguageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContentLanguageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
