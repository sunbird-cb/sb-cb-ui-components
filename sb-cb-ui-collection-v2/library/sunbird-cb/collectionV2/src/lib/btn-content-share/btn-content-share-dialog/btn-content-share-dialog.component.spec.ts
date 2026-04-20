import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { BtnContentShareDialogComponent } from './btn-content-share-dialog.component'

describe('BtnContentShareDialogComponent', () => {
  let component: BtnContentShareDialogComponent
  let fixture: ComponentFixture<BtnContentShareDialogComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BtnContentShareDialogComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BtnContentShareDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
