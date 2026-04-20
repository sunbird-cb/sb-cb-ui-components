import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MdoChannelV2Component } from './mdo-channel-v2.component';

describe('MdoChannelV2Component', () => {
  let component: MdoChannelV2Component;
  let fixture: ComponentFixture<MdoChannelV2Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MdoChannelV2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MdoChannelV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
