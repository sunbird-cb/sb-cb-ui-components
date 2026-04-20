import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { InvalidRegistrationComponent } from './invalid-registration.component'

describe('InvalidRegistrationComponent', () => {
  let component: InvalidRegistrationComponent
  let fixture: ComponentFixture<InvalidRegistrationComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [InvalidRegistrationComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(InvalidRegistrationComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
