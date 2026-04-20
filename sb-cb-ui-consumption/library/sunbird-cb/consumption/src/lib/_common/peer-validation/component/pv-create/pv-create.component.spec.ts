import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PvCreateComponent } from './pv-create.component';

describe('PvCreateComponent', () => {
  let component: PvCreateComponent;
  let fixture: ComponentFixture<PvCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PvCreateComponent]
    });
    fixture = TestBed.createComponent(PvCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
