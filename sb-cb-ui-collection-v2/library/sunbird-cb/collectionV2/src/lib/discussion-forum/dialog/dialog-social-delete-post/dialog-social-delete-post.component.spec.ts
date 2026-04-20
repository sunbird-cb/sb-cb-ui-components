import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { DialogSocialDeletePostComponent } from './dialog-social-delete-post.component'

describe('DialogSocialDeletePostComponent', () => {
  let component: DialogSocialDeletePostComponent
  let fixture: ComponentFixture<DialogSocialDeletePostComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DialogSocialDeletePostComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSocialDeletePostComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
