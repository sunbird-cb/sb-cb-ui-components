import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { TourComponent } from './tour-guide.component'

describe('TourComponent', () => {
  let component: TourComponent
  let fixture: ComponentFixture<TourComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TourComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(TourComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
