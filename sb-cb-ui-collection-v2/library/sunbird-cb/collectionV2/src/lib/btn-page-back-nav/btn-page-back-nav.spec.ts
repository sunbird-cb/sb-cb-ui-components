import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { BtnPageBackNavComponent } from './btn-page-back-nav.component'

describe('BtnPageBackNavComponent', () => {
  let component: BtnPageBackNavComponent
  let fixture: ComponentFixture<BtnPageBackNavComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BtnPageBackNavComponent],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BtnPageBackNavComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
