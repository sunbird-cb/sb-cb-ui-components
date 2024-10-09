import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { DiscussionV2Component } from './discussion-v2.component'

describe('DiscussionV2Component', () => {
  let component: DiscussionV2Component
  let fixture: ComponentFixture<DiscussionV2Component>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DiscussionV2Component],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscussionV2Component)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
