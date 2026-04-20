import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { ImageSlidersComponent } from './image-sliders.component'

describe('SlidersComponent', () => {
  let component: ImageSlidersComponent
  let fixture: ComponentFixture<ImageSlidersComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ImageSlidersComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageSlidersComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
