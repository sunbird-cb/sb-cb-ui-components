import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DataPointsComponent } from './data-points.component';

describe('DataPointsComponent', () => {
  let component: DataPointsComponent;
  let fixture: ComponentFixture<DataPointsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DataPointsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
