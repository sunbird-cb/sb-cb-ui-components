import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MdoChannelV1Component } from './mdo-channel-v1.component';

describe('MdoChannelV1Component', () => {
  let component: MdoChannelV1Component;
  let fixture: ComponentFixture<MdoChannelV1Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MdoChannelV1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MdoChannelV1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
