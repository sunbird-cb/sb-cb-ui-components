import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetencySummaryComponent } from './competency-summary.component';

describe('CompetencySummaryComponent', () => {
  let component: CompetencySummaryComponent;
  let fixture: ComponentFixture<CompetencySummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompetencySummaryComponent]
    });
    fixture = TestBed.createComponent(CompetencySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
