import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { BtnContentDownloadComponent } from './btn-content-download.component'

describe('BtnContentDownloadComponent', () => {
  let component: BtnContentDownloadComponent
  let fixture: ComponentFixture<BtnContentDownloadComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BtnContentDownloadComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BtnContentDownloadComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
