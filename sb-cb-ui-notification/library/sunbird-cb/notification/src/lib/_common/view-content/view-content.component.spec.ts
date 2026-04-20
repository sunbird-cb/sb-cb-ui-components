import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewContentComponent } from './view-content.component';

describe('ViewContentComponent', () => {
  let component: ViewContentComponent;
  let fixture: ComponentFixture<ViewContentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewContentComponent]
    });
    fixture = TestBed.createComponent(ViewContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
