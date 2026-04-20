import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CompetencyPassbookComponent } from './competency-passbook.component';

describe('CompetencyPassbookComponent', () => {
  let component: CompetencyPassbookComponent;
  let fixture: ComponentFixture<CompetencyPassbookComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CompetencyPassbookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetencyPassbookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
