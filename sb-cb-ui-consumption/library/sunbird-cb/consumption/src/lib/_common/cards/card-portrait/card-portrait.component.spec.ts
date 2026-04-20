import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CardPortraitComponent } from './card-portrait.component';

describe('CardPortraitComponent', () => {
  let component: CardPortraitComponent;
  let fixture: ComponentFixture<CardPortraitComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CardPortraitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardPortraitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
