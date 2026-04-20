import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPostDialogueComponent } from './new-post-dialogue.component';

describe('NewPostDialogueComponent', () => {
  let component: NewPostDialogueComponent;
  let fixture: ComponentFixture<NewPostDialogueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewPostDialogueComponent]
    });
    fixture = TestBed.createComponent(NewPostDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
