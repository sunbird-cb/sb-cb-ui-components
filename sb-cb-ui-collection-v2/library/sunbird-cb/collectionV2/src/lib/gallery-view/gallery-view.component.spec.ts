import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { GalleryViewComponent } from './gallery-view.component'

describe('GalleryViewComponent', () => {
  let component: GalleryViewComponent
  let fixture: ComponentFixture<GalleryViewComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [GalleryViewComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(GalleryViewComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
