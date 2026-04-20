import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { DisplayContentsComponent } from './display-contents.component'

describe('DisplayContentsComponent', () => {
  let component: DisplayContentsComponent
  let fixture: ComponentFixture<DisplayContentsComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayContentsComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayContentsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
