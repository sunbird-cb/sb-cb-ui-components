import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentRichTextComponent } from './assessment-rich-text.component';

describe('AssessmentRichTextComponent', () => {
  let component: AssessmentRichTextComponent;
  let fixture: ComponentFixture<AssessmentRichTextComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssessmentRichTextComponent]
    });
    fixture = TestBed.createComponent(AssessmentRichTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
