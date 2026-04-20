import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StripSectionCreateComponent } from './strip-section-create.component';

describe('StripSectionCreateComponent', () => {
  let component: StripSectionCreateComponent;
  let fixture: ComponentFixture<StripSectionCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StripSectionCreateComponent]
    });
    fixture = TestBed.createComponent(StripSectionCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
