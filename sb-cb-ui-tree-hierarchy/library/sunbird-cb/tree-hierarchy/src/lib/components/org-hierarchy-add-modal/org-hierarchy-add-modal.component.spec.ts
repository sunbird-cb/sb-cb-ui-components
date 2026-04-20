import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgHierarchyAddModalComponent } from './org-hierarchy-add-modal.component';

describe('OrgHierarchyAddModalComponent', () => {
  let component: OrgHierarchyAddModalComponent;
  let fixture: ComponentFixture<OrgHierarchyAddModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrgHierarchyAddModalComponent]
    });
    fixture = TestBed.createComponent(OrgHierarchyAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
