import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { PlayerPdfComponent } from './player-pdf.component'

describe('PlayerPdfComponent', () => {
  let component: PlayerPdfComponent
  let fixture: ComponentFixture<PlayerPdfComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PlayerPdfComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerPdfComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
