import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { DisplayContentTypeLibComponent } from './display-content-type-lib.component'

describe('DisplayContentTypeLibComponent', () => {
  let component: DisplayContentTypeLibComponent
  let fixture: ComponentFixture<DisplayContentTypeLibComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayContentTypeLibComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayContentTypeLibComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
