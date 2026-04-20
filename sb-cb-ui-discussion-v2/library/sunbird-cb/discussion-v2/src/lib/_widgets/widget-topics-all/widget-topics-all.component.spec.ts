import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetTopicsAllComponent } from './widget-topics-all.component';

describe('WidgetTopicsAllComponent', () => {
  let component: WidgetTopicsAllComponent;
  let fixture: ComponentFixture<WidgetTopicsAllComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WidgetTopicsAllComponent]
    });
    fixture = TestBed.createComponent(WidgetTopicsAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
