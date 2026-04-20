import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { TreeCatalogComponent } from './tree-catalog.component'

describe('TreeCatalogComponent', () => {
  let component: TreeCatalogComponent
  let fixture: ComponentFixture<TreeCatalogComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TreeCatalogComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeCatalogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
