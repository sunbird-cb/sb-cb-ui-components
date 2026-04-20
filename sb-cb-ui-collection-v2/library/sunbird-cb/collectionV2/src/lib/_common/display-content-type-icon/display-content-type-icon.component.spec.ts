import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { DisplayContentTypeIconComponent } from './display-content-type-icon.component'

describe('DisplayContentTypeIconComponent', () => {
  let component: DisplayContentTypeIconComponent
  let fixture: ComponentFixture<DisplayContentTypeIconComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayContentTypeIconComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayContentTypeIconComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
