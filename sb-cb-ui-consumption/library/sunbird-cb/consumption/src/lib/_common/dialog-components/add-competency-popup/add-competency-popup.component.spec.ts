import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCompetencyPopupComponent } from './add-competency-popup.component';

describe('AddCompetencyPopupComponent', () => {
  let component: AddCompetencyPopupComponent;
  let fixture: ComponentFixture<AddCompetencyPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddCompetencyPopupComponent]
    });
    fixture = TestBed.createComponent(AddCompetencyPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
