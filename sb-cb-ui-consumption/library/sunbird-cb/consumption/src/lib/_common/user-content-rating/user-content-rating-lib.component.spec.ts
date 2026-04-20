import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UserContentRatingLibComponent } from './user-content-rating-lib.component';

describe('UserContentRatingLibComponent', () => {
  let component: UserContentRatingLibComponent;
  let fixture: ComponentFixture<UserContentRatingLibComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UserContentRatingLibComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserContentRatingLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
