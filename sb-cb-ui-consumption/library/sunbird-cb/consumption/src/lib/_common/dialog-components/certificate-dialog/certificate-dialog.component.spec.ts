import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CertificateDialogComponent } from './certificate-dialog.component';

describe('CertificateDialogComponent', () => {
  let component: CertificateDialogComponent;
  let fixture: ComponentFixture<CertificateDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CertificateDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
