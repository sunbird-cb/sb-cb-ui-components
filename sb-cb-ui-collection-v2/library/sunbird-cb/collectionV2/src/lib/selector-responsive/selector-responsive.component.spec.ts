import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { SelectorResponsiveComponent } from './selector-responsive.component'

describe('SelectorResponsiveComponent', () => {
  let component: SelectorResponsiveComponent
  let fixture: ComponentFixture<SelectorResponsiveComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SelectorResponsiveComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectorResponsiveComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
