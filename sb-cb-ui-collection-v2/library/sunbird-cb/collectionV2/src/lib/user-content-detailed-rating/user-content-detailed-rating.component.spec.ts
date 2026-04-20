import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { UserContentDetailedRatingComponent } from './user-content-detailed-rating.component'

describe('UserContentDetailedRatingComponent', () => {
  let component: UserContentDetailedRatingComponent
  let fixture: ComponentFixture<UserContentDetailedRatingComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UserContentDetailedRatingComponent],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(UserContentDetailedRatingComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
