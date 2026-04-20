import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { PlayerVideoComponent } from './player-video.component'

describe('PlayerVideoComponent', () => {
  let component: PlayerVideoComponent
  let fixture: ComponentFixture<PlayerVideoComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PlayerVideoComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerVideoComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
