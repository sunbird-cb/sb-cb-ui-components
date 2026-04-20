import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { StickyHeaderComponent } from './sticky-header.component'

describe('StickyHeaderComponent', () => {
  let component: StickyHeaderComponent
  let fixture: ComponentFixture<StickyHeaderComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [StickyHeaderComponent],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(StickyHeaderComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
