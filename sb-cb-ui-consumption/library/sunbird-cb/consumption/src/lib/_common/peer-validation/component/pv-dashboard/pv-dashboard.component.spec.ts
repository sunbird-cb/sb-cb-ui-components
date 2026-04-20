import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PvDashboardComponent } from './pv-dashboard.component';

describe('PvDashboardComponent', () => {
  let component: PvDashboardComponent;
  let fixture: ComponentFixture<PvDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PvDashboardComponent]
    });
    fixture = TestBed.createComponent(PvDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
