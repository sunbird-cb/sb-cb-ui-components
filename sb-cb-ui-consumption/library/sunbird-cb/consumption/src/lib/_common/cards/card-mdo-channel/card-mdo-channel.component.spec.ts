import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CardMDOChannelComponent } from './card-mdo-channel.component';

describe('CardMDOChannelComponent', () => {
  let component: CardMDOChannelComponent;
  let fixture: ComponentFixture<CardMDOChannelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CardMDOChannelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardMDOChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
