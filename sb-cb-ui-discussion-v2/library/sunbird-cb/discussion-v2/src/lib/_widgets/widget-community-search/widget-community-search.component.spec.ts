import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetCommunitySearchComponent } from './widget-community-search.component';

describe('WidgetCommunitySearchComponent', () => {
  let component: WidgetCommunitySearchComponent;
  let fixture: ComponentFixture<WidgetCommunitySearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WidgetCommunitySearchComponent]
    });
    fixture = TestBed.createComponent(WidgetCommunitySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
