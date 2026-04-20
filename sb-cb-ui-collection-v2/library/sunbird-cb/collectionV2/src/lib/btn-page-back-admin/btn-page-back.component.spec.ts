import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { BtnPageBackComponent } from './btn-page-back.component'

describe('BtnPageBackComponent', () => {
  let component: BtnPageBackComponent
  let fixture: ComponentFixture<BtnPageBackComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BtnPageBackComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BtnPageBackComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
