import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProvidersV2Component } from './providers-v2.component';

describe('ProvidersV2Component', () => {
  let component: ProvidersV2Component;
  let fixture: ComponentFixture<ProvidersV2Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProvidersV2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvidersV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
