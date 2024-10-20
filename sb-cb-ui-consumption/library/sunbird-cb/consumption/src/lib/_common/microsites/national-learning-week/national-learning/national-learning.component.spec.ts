import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NationalLearningComponent } from './national-learning.component';

describe('NationalLearningComponent', () => {
  let component: NationalLearningComponent;
  let fixture: ComponentFixture<NationalLearningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NationalLearningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NationalLearningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
