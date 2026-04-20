import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CardLandscapeComponent } from './card-landscape.component';

describe('CardLandscapeComponent', () => {
  let component: CardLandscapeComponent;
  let fixture: ComponentFixture<CardLandscapeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CardLandscapeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardLandscapeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
