import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendingTagsComponent } from './trending-tags.component';

describe('TrendingTagsComponent', () => {
  let component: TrendingTagsComponent;
  let fixture: ComponentFixture<TrendingTagsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrendingTagsComponent]
    });
    fixture = TestBed.createComponent(TrendingTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
