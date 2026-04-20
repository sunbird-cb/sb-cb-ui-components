import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostCardV2Component } from './post-card-v2.component';

describe('PostCardV2Component', () => {
  let component: PostCardV2Component;
  let fixture: ComponentFixture<PostCardV2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PostCardV2Component]
    });
    fixture = TestBed.createComponent(PostCardV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
