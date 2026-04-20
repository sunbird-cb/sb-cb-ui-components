import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TOCMultiLingualDialogComponent } from './toc-multi-lingual-dialog.component';

describe('TOCMultiLingualDialogComponent', () => {
  let component: TOCMultiLingualDialogComponent;
  let fixture: ComponentFixture<TOCMultiLingualDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TOCMultiLingualDialogComponent]
    });
    fixture = TestBed.createComponent(TOCMultiLingualDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
