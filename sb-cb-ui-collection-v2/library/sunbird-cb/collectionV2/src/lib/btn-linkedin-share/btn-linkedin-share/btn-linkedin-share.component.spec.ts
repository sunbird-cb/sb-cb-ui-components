import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { BtnLinkedinShareComponent } from './btn-linkedin-share.component'

describe('BtnLinkedinShareComponent', () => {
  let component: BtnLinkedinShareComponent
  let fixture: ComponentFixture<BtnLinkedinShareComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BtnLinkedinShareComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BtnLinkedinShareComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
