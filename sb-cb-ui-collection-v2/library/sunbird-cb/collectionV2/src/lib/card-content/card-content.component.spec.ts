import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { CardContentComponent } from './card-content.component'

describe('CardContentComponent', () => {
  let component: CardContentComponent
  let fixture: ComponentFixture<CardContentComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CardContentComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CardContentComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
