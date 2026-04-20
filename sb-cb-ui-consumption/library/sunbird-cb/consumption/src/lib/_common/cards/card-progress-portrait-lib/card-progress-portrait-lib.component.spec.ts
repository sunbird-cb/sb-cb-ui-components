import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CardProgressPortraitLibComponent } from './card-progress-portrait-lib.component';

describe('CardProgressPortraitLibComponent', () => {
  let component: CardProgressPortraitLibComponent;
  let fixture: ComponentFixture<CardProgressPortraitLibComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CardProgressPortraitLibComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardProgressPortraitLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
