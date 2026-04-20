import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { BtnPlaylistSelectionComponent } from './btn-playlist-selection.component'

describe('BtnPlaylistSelectionComponent', () => {
  let component: BtnPlaylistSelectionComponent
  let fixture: ComponentFixture<BtnPlaylistSelectionComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BtnPlaylistSelectionComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BtnPlaylistSelectionComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
