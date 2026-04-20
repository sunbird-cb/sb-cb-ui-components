import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { MarkAsCompleteConfirmDialogComponent } from './confirm-dialog.component'

describe('MarkAsCompleteConfirmDialogComponent', () => {
  let component: MarkAsCompleteConfirmDialogComponent
  let fixture: ComponentFixture<MarkAsCompleteConfirmDialogComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MarkAsCompleteConfirmDialogComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkAsCompleteConfirmDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
