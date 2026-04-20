import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyHighlightsComponent } from './key-highlights.component';

describe('KeyHighlightsComponent', () => {
  let component: KeyHighlightsComponent;
  let fixture: ComponentFixture<KeyHighlightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeyHighlightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyHighlightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
