import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { CardKnowledgeComponent } from './card-knowledge.component'

describe('CardKnowledgeComponent', () => {
  let component: CardKnowledgeComponent
  let fixture: ComponentFixture<CardKnowledgeComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CardKnowledgeComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CardKnowledgeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
