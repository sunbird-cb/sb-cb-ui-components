import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { ContentStripMultipleComponent } from './content-strip-multiple.component'

describe('ContentStripMultipleComponent', () => {
  let component: ContentStripMultipleComponent
  let fixture: ComponentFixture<ContentStripMultipleComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ContentStripMultipleComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentStripMultipleComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
