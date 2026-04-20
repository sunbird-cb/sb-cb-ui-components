import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { ImageMapResponsiveComponent } from './image-map-responsive.component'

describe('ImageMapResponsiveComponent', () => {
  let component: ImageMapResponsiveComponent
  let fixture: ComponentFixture<ImageMapResponsiveComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ImageMapResponsiveComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageMapResponsiveComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
