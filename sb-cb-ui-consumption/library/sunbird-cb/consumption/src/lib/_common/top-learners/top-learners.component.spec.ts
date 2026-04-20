import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TopLearnersComponent } from './top-learners.component';

describe('TopLearnersComponent', () => {
  let component: TopLearnersComponent;
  let fixture: ComponentFixture<TopLearnersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TopLearnersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopLearnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
