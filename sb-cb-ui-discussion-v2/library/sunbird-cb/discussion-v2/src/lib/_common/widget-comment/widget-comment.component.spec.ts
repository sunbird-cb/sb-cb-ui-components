import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { WidgetCommentComponent } from './widget-comment.component'

describe('WidgetCommentComponent', () => {
  let component: WidgetCommentComponent
  let fixture: ComponentFixture<WidgetCommentComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WidgetCommentComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetCommentComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
