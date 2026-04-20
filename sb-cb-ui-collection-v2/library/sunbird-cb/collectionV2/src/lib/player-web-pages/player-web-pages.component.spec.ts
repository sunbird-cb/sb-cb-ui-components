import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { PlayerWebPagesComponent } from './player-web-pages.component'

describe('PlayerWebPagesComponent', () => {
  let component: PlayerWebPagesComponent
  let fixture: ComponentFixture<PlayerWebPagesComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PlayerWebPagesComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerWebPagesComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
