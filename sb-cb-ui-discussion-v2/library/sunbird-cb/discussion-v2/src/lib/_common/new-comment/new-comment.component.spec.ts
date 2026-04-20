import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { NewCommentComponent } from './new-comment.component'

describe('PostCommentComponent', () => {
  let component: NewCommentComponent
  let fixture: ComponentFixture<NewCommentComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [NewCommentComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCommentComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
