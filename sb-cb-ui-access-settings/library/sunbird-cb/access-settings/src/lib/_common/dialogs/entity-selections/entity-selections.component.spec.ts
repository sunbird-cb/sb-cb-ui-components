import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntitySelectionsComponent } from './entity-selections.component';

describe('EntitySelectionsComponent', () => {
  let component: EntitySelectionsComponent;
  let fixture: ComponentFixture<EntitySelectionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EntitySelectionsComponent]
    });
    fixture = TestBed.createComponent(EntitySelectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
