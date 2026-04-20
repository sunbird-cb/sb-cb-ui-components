import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersListTableComponent } from './list-table.component';

describe('UsersListTableComponent', () => {
  let component: UsersListTableComponent;
  let fixture: ComponentFixture<UsersListTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsersListTableComponent]
    });
    fixture = TestBed.createComponent(UsersListTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
