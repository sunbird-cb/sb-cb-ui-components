import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { BtnFeatureComponent } from './btn-feature.component'

describe('BtnFeatureComponent', () => {
  let component: BtnFeatureComponent
  let fixture: ComponentFixture<BtnFeatureComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BtnFeatureComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BtnFeatureComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
