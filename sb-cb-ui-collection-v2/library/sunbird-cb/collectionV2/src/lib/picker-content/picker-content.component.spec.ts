import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { PickerContentComponent } from './picker-content.component'

describe('PickerContentComponent', () => {
  let component: PickerContentComponent
  let fixture: ComponentFixture<PickerContentComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PickerContentComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PickerContentComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
