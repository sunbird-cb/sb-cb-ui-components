import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PvQuestionStepComponent } from './pv-question-step.component';

describe('PvQuestionStepComponent', () => {
  let component: PvQuestionStepComponent;
  let fixture: ComponentFixture<PvQuestionStepComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PvQuestionStepComponent]
    });
    fixture = TestBed.createComponent(PvQuestionStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
