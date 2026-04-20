import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeHierarchyComponent } from './tree-hierarchy.component';

describe('TreeHierarchyComponent', () => {
  let component: TreeHierarchyComponent;
  let fixture: ComponentFixture<TreeHierarchyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreeHierarchyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreeHierarchyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
