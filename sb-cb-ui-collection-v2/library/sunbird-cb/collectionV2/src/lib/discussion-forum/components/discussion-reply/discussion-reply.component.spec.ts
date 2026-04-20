import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { DiscussionReplyComponent } from './discussion-reply.component'

describe('DiscussionReplyComponent', () => {
  let component: DiscussionReplyComponent
  let fixture: ComponentFixture<DiscussionReplyComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DiscussionReplyComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscussionReplyComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
