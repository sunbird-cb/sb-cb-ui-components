import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { PlayerAudioComponent } from './player-audio.component'

describe('PlayerAudioComponent', () => {
  let component: PlayerAudioComponent
  let fixture: ComponentFixture<PlayerAudioComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PlayerAudioComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerAudioComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
