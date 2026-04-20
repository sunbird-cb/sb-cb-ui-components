import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { BtnGoalsComponent } from './btn-goals.component'

describe('BtnGoalsComponent', () => {
  let component: BtnGoalsComponent
  let fixture: ComponentFixture<BtnGoalsComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BtnGoalsComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BtnGoalsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
