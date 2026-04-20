import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { InvalidPermissionComponent } from './invalid-permission.component'

describe('InvalidPermissionComponent', () => {
  let component: InvalidPermissionComponent
  let fixture: ComponentFixture<InvalidPermissionComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [InvalidPermissionComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(InvalidPermissionComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
