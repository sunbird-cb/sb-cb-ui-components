import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { BtnPreviewComponent } from './btn-preview.component'

describe('BtnPreviewComponent', () => {
  let component: BtnPreviewComponent
  let fixture: ComponentFixture<BtnPreviewComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BtnPreviewComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BtnPreviewComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
