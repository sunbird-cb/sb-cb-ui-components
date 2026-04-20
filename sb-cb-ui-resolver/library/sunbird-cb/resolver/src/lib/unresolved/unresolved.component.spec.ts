import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { UnresolvedComponent } from './unresolved.component'

describe('UnresolvedComponent', () => {
  let component: UnresolvedComponent
  let fixture: ComponentFixture<UnresolvedComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UnresolvedComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(UnresolvedComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
