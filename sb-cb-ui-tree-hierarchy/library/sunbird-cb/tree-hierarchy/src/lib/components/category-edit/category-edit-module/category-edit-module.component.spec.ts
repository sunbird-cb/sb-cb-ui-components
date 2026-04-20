import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryEditModuleComponent } from './category-edit-module.component';

describe('CategoryEditModuleComponent', () => {
  let component: CategoryEditModuleComponent;
  let fixture: ComponentFixture<CategoryEditModuleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategoryEditModuleComponent]
    });
    fixture = TestBed.createComponent(CategoryEditModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
