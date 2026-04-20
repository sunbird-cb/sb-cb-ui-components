import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlagDialogueComponent } from './flag-dialogue.component';

describe('FlagDialogueComponent', () => {
  let component: FlagDialogueComponent;
  let fixture: ComponentFixture<FlagDialogueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FlagDialogueComponent]
    });
    fixture = TestBed.createComponent(FlagDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
