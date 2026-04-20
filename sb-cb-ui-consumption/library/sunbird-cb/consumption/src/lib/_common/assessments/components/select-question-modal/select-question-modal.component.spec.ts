import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectQuestionModalComponent } from './select-question-modal.component';

describe('SelectQuestionModalComponent', () => {
  let component: SelectQuestionModalComponent;
  let fixture: ComponentFixture<SelectQuestionModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectQuestionModalComponent]
    });
    fixture = TestBed.createComponent(SelectQuestionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
