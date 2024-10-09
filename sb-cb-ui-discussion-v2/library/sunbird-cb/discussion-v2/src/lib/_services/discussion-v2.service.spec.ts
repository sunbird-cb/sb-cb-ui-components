import { TestBed } from '@angular/core/testing'

import { DiscussionV2Service } from './discussion-v2.service'

describe('DiscussionV2Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: DiscussionV2Service = TestBed.get(DiscussionV2Service)
    expect(service).toBeTruthy()
  })
})
