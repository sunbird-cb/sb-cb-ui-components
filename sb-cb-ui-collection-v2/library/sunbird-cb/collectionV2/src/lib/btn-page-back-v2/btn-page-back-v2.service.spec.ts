import { TestBed } from '@angular/core/testing'
import { BtnPageBackV2Service } from './btn-page-back-v2.service'
import { Router } from '@angular/router'

describe('BtnPageBackV2Service', () => {
  let service: BtnPageBackV2Service

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Router,
          useValue: {
            events: {
              subscribe: () => { }
            }
          }
        }
      ]
    })
    service = TestBed.inject(BtnPageBackV2Service)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
