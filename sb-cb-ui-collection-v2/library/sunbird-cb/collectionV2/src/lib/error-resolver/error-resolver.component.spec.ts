import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { ErrorResolverComponent } from './error-resolver.component'

describe('ErrorResolverComponent', () => {
  let component: ErrorResolverComponent
  let fixture: ComponentFixture<ErrorResolverComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ErrorResolverComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorResolverComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
