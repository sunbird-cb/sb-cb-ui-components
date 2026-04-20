import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CardMdoChannelV1Component } from './card-mdo-channel-v1.component';

describe('CardMdoChannelV1Component', () => {
  let component: CardMdoChannelV1Component;
  let fixture: ComponentFixture<CardMdoChannelV1Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CardMdoChannelV1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardMdoChannelV1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
