import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentMainComponent } from './assessment-main.component';

describe('AssessmentMainComponent', () => {
  let component: AssessmentMainComponent;
  let fixture: ComponentFixture<AssessmentMainComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssessmentMainComponent]
    });
    fixture = TestBed.createComponent(AssessmentMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
