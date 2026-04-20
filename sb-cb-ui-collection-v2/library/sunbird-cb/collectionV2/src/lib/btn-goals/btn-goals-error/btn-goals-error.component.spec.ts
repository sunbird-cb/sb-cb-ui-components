import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { BtnGoalsErrorComponent } from './btn-goals-error.component'

describe('BtnGoalsErrorComponent', () => {
  let component: BtnGoalsErrorComponent
  let fixture: ComponentFixture<BtnGoalsErrorComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BtnGoalsErrorComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BtnGoalsErrorComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
