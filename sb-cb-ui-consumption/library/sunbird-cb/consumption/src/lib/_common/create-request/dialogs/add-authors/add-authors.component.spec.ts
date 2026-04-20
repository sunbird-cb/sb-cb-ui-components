import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAuthorsComponent } from './add-authors.component';

describe('AddAuthorsComponent', () => {
  let component: AddAuthorsComponent;
  let fixture: ComponentFixture<AddAuthorsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddAuthorsComponent]
    });
    fixture = TestBed.createComponent(AddAuthorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
