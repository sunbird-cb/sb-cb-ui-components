import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { BtnCallDialogComponent } from './btn-call-dialog.component'

describe('BtnCallDialogComponent', () => {
  let component: BtnCallDialogComponent
  let fixture: ComponentFixture<BtnCallDialogComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BtnCallDialogComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BtnCallDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
