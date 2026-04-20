import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { PlayerSlidesComponent } from './player-slides.component'

describe('PlayerSlidesComponent', () => {
  let component: PlayerSlidesComponent
  let fixture: ComponentFixture<PlayerSlidesComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PlayerSlidesComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerSlidesComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
