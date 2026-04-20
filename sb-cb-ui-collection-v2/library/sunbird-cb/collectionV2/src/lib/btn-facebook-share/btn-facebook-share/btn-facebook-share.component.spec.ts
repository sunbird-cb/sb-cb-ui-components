import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { BtnFacebookShareComponent } from './btn-facebook-share.component'

describe('BtnFacebookShareComponent', () => {
  let component: BtnFacebookShareComponent
  let fixture: ComponentFixture<BtnFacebookShareComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BtnFacebookShareComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BtnFacebookShareComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
