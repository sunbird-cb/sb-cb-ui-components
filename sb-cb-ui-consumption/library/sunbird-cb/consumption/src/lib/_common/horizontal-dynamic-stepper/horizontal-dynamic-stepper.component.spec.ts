import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorizontalDynamicStepperComponent } from './horizontal-dynamic-stepper.component';

describe('HorizontalDynamicStepperComponent', () => {
  let component: HorizontalDynamicStepperComponent;
  let fixture: ComponentFixture<HorizontalDynamicStepperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HorizontalDynamicStepperComponent]
    });
    fixture = TestBed.createComponent(HorizontalDynamicStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
