import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { AppTourDialogComponent } from './app-tour-dialog.component'

describe('AppTourDialogComponent', () => {
  let component: AppTourDialogComponent
  let fixture: ComponentFixture<AppTourDialogComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AppTourDialogComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AppTourDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
