import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { BtnCatalogComponent } from './btn-catalog.component'

describe('BtnCatalogComponent', () => {
  let component: BtnCatalogComponent
  let fixture: ComponentFixture<BtnCatalogComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BtnCatalogComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BtnCatalogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
