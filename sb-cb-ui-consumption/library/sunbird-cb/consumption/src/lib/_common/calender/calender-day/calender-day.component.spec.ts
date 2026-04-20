import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CalenderDayComponent } from './calender-day.component';

describe('CalenderDayComponent', () => {
  let component: CalenderDayComponent;
  let fixture: ComponentFixture<CalenderDayComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CalenderDayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalenderDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
