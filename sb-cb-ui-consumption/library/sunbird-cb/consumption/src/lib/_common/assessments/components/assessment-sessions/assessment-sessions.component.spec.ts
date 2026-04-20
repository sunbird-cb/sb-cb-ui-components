import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentSessionsComponent } from './assessment-sessions.component';

describe('AssessmentSessionsComponent', () => {
  let component: AssessmentSessionsComponent;
  let fixture: ComponentFixture<AssessmentSessionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssessmentSessionsComponent]
    });
    fixture = TestBed.createComponent(AssessmentSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
