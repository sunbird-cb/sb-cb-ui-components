import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { BtnMailUserDialogComponent } from './btn-mail-user-dialog.component'

describe('BtnMailUserDialogComponent', () => {
  let component: BtnMailUserDialogComponent
  let fixture: ComponentFixture<BtnMailUserDialogComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BtnMailUserDialogComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BtnMailUserDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
