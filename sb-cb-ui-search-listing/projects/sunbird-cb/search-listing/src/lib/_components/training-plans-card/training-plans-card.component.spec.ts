import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingPlansCardComponent } from './training-plans-card.component';

describe('TrainingPlansCardComponent', () => {
  let component: TrainingPlansCardComponent;
  let fixture: ComponentFixture<TrainingPlansCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrainingPlansCardComponent]
    });
    fixture = TestBed.createComponent(TrainingPlansCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
