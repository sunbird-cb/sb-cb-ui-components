import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CompetencyPassbookMdoComponent } from './competency-passbook-mdo.component';

describe('CompetencyPassbookMdoComponent', () => {
  let component: CompetencyPassbookMdoComponent;
  let fixture: ComponentFixture<CompetencyPassbookMdoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CompetencyPassbookMdoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetencyPassbookMdoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
