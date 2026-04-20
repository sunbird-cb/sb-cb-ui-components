import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StripAddContentComponent } from './strip-add-content.component';

describe('StripAddContentComponent', () => {
  let component: StripAddContentComponent;
  let fixture: ComponentFixture<StripAddContentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StripAddContentComponent]
    });
    fixture = TestBed.createComponent(StripAddContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
