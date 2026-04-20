import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TreeColumnViewComponent } from './tree-column-view.component';

describe('TreeColumnViewComponent', () => {
  let component: TreeColumnViewComponent;
  let fixture: ComponentFixture<TreeColumnViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TreeColumnViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeColumnViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
