import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetencyCardComponent } from './competency-card.component';

describe('CompetencyCardComponent', () => {
  let component: CompetencyCardComponent;
  let fixture: ComponentFixture<CompetencyCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompetencyCardComponent]
    });
    fixture = TestBed.createComponent(CompetencyCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
