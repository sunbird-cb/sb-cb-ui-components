import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CardWideComponent } from './card-wide.component';

describe('CardWideComponent', () => {
  let component: CardWideComponent;
  let fixture: ComponentFixture<CardWideComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CardWideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardWideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
