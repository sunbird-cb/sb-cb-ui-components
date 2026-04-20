import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ShareDiscussionComponent } from './share-discussion.component'

describe('ShareDiscussionComponent', () => {
  let component: ShareDiscussionComponent
  let fixture: ComponentFixture<ShareDiscussionComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShareDiscussionComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareDiscussionComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
