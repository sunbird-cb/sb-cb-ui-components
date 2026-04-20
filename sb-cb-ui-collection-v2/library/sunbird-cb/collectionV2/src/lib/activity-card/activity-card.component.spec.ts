import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { ActivityCardComponent } from './activity-card.component'

describe('ActivityCardComponent', () => {
  let component: ActivityCardComponent
  let fixture: ComponentFixture<ActivityCardComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ActivityCardComponent],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityCardComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
