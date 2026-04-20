import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CardKarmaProgramsComponent } from './card-karma-programs.component';

describe('CardKarmaProgramsComponent', () => {
  let component: CardKarmaProgramsComponent;
  let fixture: ComponentFixture<CardKarmaProgramsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CardKarmaProgramsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardKarmaProgramsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
