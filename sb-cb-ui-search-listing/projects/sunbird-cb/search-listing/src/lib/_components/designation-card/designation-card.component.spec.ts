import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignationCardComponent } from './designation-card.component';

describe('DesignationCardComponent', () => {
  let component: DesignationCardComponent;
  let fixture: ComponentFixture<DesignationCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DesignationCardComponent]
    });
    fixture = TestBed.createComponent(DesignationCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
