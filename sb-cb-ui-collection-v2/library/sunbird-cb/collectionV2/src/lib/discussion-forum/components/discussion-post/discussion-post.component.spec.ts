import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { DiscussionPostComponent } from './discussion-post.component'

describe('DiscussionPostComponent', () => {
  let component: DiscussionPostComponent
  let fixture: ComponentFixture<DiscussionPostComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DiscussionPostComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscussionPostComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
