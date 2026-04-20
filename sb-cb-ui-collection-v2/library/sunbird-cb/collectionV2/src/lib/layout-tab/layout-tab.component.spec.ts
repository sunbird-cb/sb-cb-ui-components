import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { LayoutTabComponent } from './layout-tab.component'

describe('LayoutTabComponent', () => {
  let component: LayoutTabComponent
  let fixture: ComponentFixture<LayoutTabComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LayoutTabComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutTabComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
