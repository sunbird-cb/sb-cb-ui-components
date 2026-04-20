import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { MarkAsCompleteComponent } from './mark-as-complete.component'

describe('MarkAsCompleteComponent', () => {
  let component: MarkAsCompleteComponent
  let fixture: ComponentFixture<MarkAsCompleteComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MarkAsCompleteComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkAsCompleteComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
