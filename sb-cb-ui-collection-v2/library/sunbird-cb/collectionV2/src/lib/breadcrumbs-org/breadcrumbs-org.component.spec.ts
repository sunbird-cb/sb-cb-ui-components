import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { BreadcrumbsOrgComponent } from './breadcrumbs-org.component'

describe('BreadcrumbsOrgComponent', () => {
  let component: BreadcrumbsOrgComponent
  let fixture: ComponentFixture<BreadcrumbsOrgComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BreadcrumbsOrgComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BreadcrumbsOrgComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
