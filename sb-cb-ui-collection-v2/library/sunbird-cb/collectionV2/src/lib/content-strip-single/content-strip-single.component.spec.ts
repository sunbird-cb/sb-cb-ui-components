import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { ContentStripSingleComponent } from './content-strip-single.component'

describe('ContentStripSingleComponent', () => {
  let component: ContentStripSingleComponent
  let fixture: ComponentFixture<ContentStripSingleComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ContentStripSingleComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentStripSingleComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
