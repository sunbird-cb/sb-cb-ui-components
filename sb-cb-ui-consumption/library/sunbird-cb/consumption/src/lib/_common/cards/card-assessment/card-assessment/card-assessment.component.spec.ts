import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CardAssessmentComponent } from './card-assessment.component';

describe('CardAssessmentComponent', () => {
  let component: CardAssessmentComponent;
  let fixture: ComponentFixture<CardAssessmentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CardAssessmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
