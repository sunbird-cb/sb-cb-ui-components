import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CardKarmaProgramsV2Component } from './card-karma-programs-v2.component';

describe('CardKarmaProgramsV2Component', () => {
  let component: CardKarmaProgramsV2Component;
  let fixture: ComponentFixture<CardKarmaProgramsV2Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CardKarmaProgramsV2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardKarmaProgramsV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
