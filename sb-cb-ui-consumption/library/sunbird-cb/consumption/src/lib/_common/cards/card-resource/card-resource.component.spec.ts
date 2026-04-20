import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CardResourceComponent } from './card-resource.component';

describe('CardResourceComponent', () => {
  let component: CardResourceComponent;
  let fixture: ComponentFixture<CardResourceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CardResourceComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
