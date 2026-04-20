import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessControlGuideComponent } from './access-control-guide.component';

describe('AccessControlGuideComponent', () => {
  let component: AccessControlGuideComponent;
  let fixture: ComponentFixture<AccessControlGuideComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccessControlGuideComponent]
    });
    fixture = TestBed.createComponent(AccessControlGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
