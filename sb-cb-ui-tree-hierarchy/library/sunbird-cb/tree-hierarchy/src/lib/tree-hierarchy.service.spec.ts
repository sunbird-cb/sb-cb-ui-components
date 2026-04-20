import { TestBed } from '@angular/core/testing';

import { TreeHierarchyService } from './tree-hierarchy.service';

describe('TreeHierarchyService', () => {
  let service: TreeHierarchyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TreeHierarchyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
