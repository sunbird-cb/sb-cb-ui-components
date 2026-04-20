import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetDiscussionv2LandingPageComponent } from './widget-discussionv2-landing-page.component';

describe('WidgetDiscussionv2LandingPageComponent', () => {
  let component: WidgetDiscussionv2LandingPageComponent;
  let fixture: ComponentFixture<WidgetDiscussionv2LandingPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WidgetDiscussionv2LandingPageComponent]
    });
    fixture = TestBed.createComponent(WidgetDiscussionv2LandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
