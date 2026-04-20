import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkUploadKarmayogiComponent } from './bulk-upload-karmayogi.component';

describe('BulkUploadKarmayogiComponent', () => {
  let component: BulkUploadKarmayogiComponent;
  let fixture: ComponentFixture<BulkUploadKarmayogiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BulkUploadKarmayogiComponent]
    });
    fixture = TestBed.createComponent(BulkUploadKarmayogiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
