import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetCommunityHomeComponent } from './widget-community-home.component';

describe('WidgetCommunityHomeComponent', () => {
  let component: WidgetCommunityHomeComponent;
  let fixture: ComponentFixture<WidgetCommunityHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WidgetCommunityHomeComponent]
    });
    fixture = TestBed.createComponent(WidgetCommunityHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
