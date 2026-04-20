import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { OrgUserTableV2Component } from './org-user-table-v2.component'

describe('OrgTableV2Component', () => {
  let component: OrgUserTableV2Component
  let fixture: ComponentFixture<OrgUserTableV2Component>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OrgUserTableV2Component],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgUserTableV2Component)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
