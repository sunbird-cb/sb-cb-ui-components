import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CbpPlanComponent } from './cbp-plan.component';

describe('CbpPlanComponent', () => {
  let component: CbpPlanComponent;
  let fixture: ComponentFixture<CbpPlanComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CbpPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CbpPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
