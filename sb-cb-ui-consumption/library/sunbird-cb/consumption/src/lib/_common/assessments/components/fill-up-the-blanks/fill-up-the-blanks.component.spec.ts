import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FillUpTheBlanksComponent } from './fill-up-the-blanks.component';

describe('FillUpTheBlanksComponent', () => {
  let component: FillUpTheBlanksComponent;
  let fixture: ComponentFixture<FillUpTheBlanksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FillUpTheBlanksComponent]
    });
    fixture = TestBed.createComponent(FillUpTheBlanksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
