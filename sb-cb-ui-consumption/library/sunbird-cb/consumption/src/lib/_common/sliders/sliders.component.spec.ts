import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { SlidersComponent } from './sliders.component'

describe('SlidersComponent', () => {
  let component: SlidersComponent
  let fixture: ComponentFixture<SlidersComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SlidersComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(SlidersComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
