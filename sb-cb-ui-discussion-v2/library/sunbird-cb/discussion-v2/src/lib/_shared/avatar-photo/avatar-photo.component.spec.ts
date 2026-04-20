import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { AvatarPhotoComponent } from './avatar-photo.component'

describe('AvatarPhotoComponent', () => {
  let component: AvatarPhotoComponent
  let fixture: ComponentFixture<AvatarPhotoComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AvatarPhotoComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AvatarPhotoComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
