import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { CardBreadcrumbComponent } from './card-breadcrumb.component'

describe('CardBreadcrumbComponent', () => {
  let component: CardBreadcrumbComponent
  let fixture: ComponentFixture<CardBreadcrumbComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CardBreadcrumbComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CardBreadcrumbComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
