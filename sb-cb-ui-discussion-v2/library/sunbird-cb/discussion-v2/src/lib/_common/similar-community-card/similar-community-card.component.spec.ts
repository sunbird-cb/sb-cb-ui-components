import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimilarCommunityCardComponent } from './similar-community-card.component';

describe('SimilarCommunityCardComponent', () => {
  let component: SimilarCommunityCardComponent;
  let fixture: ComponentFixture<SimilarCommunityCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SimilarCommunityCardComponent]
    });
    fixture = TestBed.createComponent(SimilarCommunityCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
