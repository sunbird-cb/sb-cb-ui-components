import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PvConfigStepComponent } from './pv-config-step.component';

describe('PvConfigStepComponent', () => {
  let component: PvConfigStepComponent;
  let fixture: ComponentFixture<PvConfigStepComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PvConfigStepComponent]
    });
    fixture = TestBed.createComponent(PvConfigStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
