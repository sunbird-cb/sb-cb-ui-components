import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { BtnPreviewDialogComponent } from './btn-preview-dialog.component'

describe('BtnPreviewDialogComponent', () => {
  let component: BtnPreviewDialogComponent
  let fixture: ComponentFixture<BtnPreviewDialogComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BtnPreviewDialogComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BtnPreviewDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
