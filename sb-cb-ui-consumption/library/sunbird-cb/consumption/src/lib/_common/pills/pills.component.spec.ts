import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PillsComponent } from './pills.component';

describe('PillsComponent', () => {
  let component: PillsComponent;
  let fixture: ComponentFixture<PillsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PillsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
