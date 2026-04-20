import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { SlidersNgContentLibComponent } from './sliders-ng-content.component'

describe('SlidersNgContentLibComponent', () => {
  let component: SlidersNgContentLibComponent
  let fixture: ComponentFixture<SlidersNgContentLibComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SlidersNgContentLibComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(SlidersNgContentLibComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
