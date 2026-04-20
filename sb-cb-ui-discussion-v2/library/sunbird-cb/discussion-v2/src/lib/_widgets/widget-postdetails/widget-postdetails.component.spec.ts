import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetPostdetailsComponent } from './widget-postdetails.component';

describe('WidgetPostdetailsComponent', () => {
  let component: WidgetPostdetailsComponent;
  let fixture: ComponentFixture<WidgetPostdetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WidgetPostdetailsComponent]
    });
    fixture = TestBed.createComponent(WidgetPostdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
