import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SortByComponent } from './sort-by.component';

describe('SortByComponent', () => {
  let component: SortByComponent;
  let fixture: ComponentFixture<SortByComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SortByComponent]
    });
    fixture = TestBed.createComponent(SortByComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
