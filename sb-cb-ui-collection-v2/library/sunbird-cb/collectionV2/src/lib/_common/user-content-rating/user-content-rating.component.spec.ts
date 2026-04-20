import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { UserContentRatingComponent } from './user-content-rating.component'

describe('UserContentRatingComponent', () => {
  let component: UserContentRatingComponent
  let fixture: ComponentFixture<UserContentRatingComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UserContentRatingComponent],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(UserContentRatingComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
