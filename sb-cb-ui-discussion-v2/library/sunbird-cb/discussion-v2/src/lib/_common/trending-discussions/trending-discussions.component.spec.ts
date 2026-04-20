import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendingDiscussionsComponent } from './trending-discussions.component';

describe('TrendingDiscussionsComponent', () => {
  let component: TrendingDiscussionsComponent;
  let fixture: ComponentFixture<TrendingDiscussionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrendingDiscussionsComponent]
    });
    fixture = TestBed.createComponent(TrendingDiscussionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
