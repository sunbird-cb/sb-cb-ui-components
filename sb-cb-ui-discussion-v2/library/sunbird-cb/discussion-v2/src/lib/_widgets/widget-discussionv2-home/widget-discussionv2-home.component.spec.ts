import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetDiscussionv2HomeComponent } from './widget-discussionv2-home.component';

describe('WidgetDiscussionv2HomeComponent', () => {
  let component: WidgetDiscussionv2HomeComponent;
  let fixture: ComponentFixture<WidgetDiscussionv2HomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WidgetDiscussionv2HomeComponent]
    });
    fixture = TestBed.createComponent(WidgetDiscussionv2HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
