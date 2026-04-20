import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { GraphGeneralComponent } from './graph-general.component'

describe('GraphGeneralComponent', () => {
  let component: GraphGeneralComponent
  let fixture: ComponentFixture<GraphGeneralComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [GraphGeneralComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphGeneralComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
