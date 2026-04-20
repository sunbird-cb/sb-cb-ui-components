import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { SlidersMobComponent } from './sliders-mob.component'

describe('SlidersMobComponent', () => {
  let component: SlidersMobComponent
  let fixture: ComponentFixture<SlidersMobComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SlidersMobComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(SlidersMobComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
