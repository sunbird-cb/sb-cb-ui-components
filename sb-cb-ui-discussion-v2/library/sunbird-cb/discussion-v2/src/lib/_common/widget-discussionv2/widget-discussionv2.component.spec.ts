import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetDiscussionv2Component } from './widget-discussionv2.component';

describe('WidgetDiscussionv2Component', () => {
  let component: WidgetDiscussionv2Component;
  let fixture: ComponentFixture<WidgetDiscussionv2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WidgetDiscussionv2Component]
    });
    fixture = TestBed.createComponent(WidgetDiscussionv2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
