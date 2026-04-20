import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { DialogSocialActivityUserComponent } from './dialog-social-activity-user.component'

describe('DialogSocialActivityUserComponent', () => {
  let component: DialogSocialActivityUserComponent
  let fixture: ComponentFixture<DialogSocialActivityUserComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DialogSocialActivityUserComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSocialActivityUserComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
