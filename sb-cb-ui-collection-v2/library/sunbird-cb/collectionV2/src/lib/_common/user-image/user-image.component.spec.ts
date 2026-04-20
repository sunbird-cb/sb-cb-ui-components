import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { UserImageComponent } from './user-image.component'

describe('UserImageComponent', () => {
  let component: UserImageComponent
  let fixture: ComponentFixture<UserImageComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UserImageComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(UserImageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
