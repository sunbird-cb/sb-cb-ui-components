import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityGuideLinesComponent } from './community-guide-lines.component';

describe('CommunityGuideLinesComponent', () => {
  let component: CommunityGuideLinesComponent;
  let fixture: ComponentFixture<CommunityGuideLinesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommunityGuideLinesComponent]
    });
    fixture = TestBed.createComponent(CommunityGuideLinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
