import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnowledgeLevelComponent } from './knowledge-level.component';

describe('KnowledgeLevelComponent', () => {
  let component: KnowledgeLevelComponent;
  let fixture: ComponentFixture<KnowledgeLevelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KnowledgeLevelComponent]
    });
    fixture = TestBed.createComponent(KnowledgeLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
