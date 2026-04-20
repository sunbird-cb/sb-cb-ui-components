import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CardWideV2Component } from './card-wide-v2.component';

describe('CardWideV2Component', () => {
  let component: CardWideV2Component;
  let fixture: ComponentFixture<CardWideV2Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CardWideV2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardWideV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
