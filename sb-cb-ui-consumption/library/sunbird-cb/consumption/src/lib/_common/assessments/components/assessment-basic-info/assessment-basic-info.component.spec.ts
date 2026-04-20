import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentBasicInfoComponent } from './assessment-basic-info.component';

describe('AssessmentBasicInfoComponent', () => {
  let component: AssessmentBasicInfoComponent;
  let fixture: ComponentFixture<AssessmentBasicInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssessmentBasicInfoComponent]
    });
    fixture = TestBed.createComponent(AssessmentBasicInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
