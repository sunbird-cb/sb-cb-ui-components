import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkUploadAllTypeQuestionComponent } from './bulk-upload-all-type-question.component';

describe('BulkUploadAllTypeQuestionComponent', () => {
  let component: BulkUploadAllTypeQuestionComponent;
  let fixture: ComponentFixture<BulkUploadAllTypeQuestionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BulkUploadAllTypeQuestionComponent]
    });
    fixture = TestBed.createComponent(BulkUploadAllTypeQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
