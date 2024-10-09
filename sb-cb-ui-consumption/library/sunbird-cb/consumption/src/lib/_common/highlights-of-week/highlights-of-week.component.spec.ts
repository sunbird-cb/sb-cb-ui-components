import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HighlightsOfWeekComponent } from './highlights-of-week.component';

describe('HighlightsOfWeekComponent', () => {
  let component: HighlightsOfWeekComponent;
  let fixture: ComponentFixture<HighlightsOfWeekComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HighlightsOfWeekComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HighlightsOfWeekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
