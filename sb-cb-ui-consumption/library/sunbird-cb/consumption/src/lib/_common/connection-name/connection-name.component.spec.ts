import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionNameComponent } from './connection-name.component';

describe('ConnectionNameComponent', () => {
  let component: ConnectionNameComponent;
  let fixture: ComponentFixture<ConnectionNameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConnectionNameComponent]
    });
    fixture = TestBed.createComponent(ConnectionNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
