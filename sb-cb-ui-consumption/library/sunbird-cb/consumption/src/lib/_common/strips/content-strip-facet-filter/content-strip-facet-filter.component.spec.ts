import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentStripFacetFilterComponent } from './content-strip-facet-filter.component';

describe('ContentStripFacetFilterComponent', () => {
  let component: ContentStripFacetFilterComponent;
  let fixture: ComponentFixture<ContentStripFacetFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentStripFacetFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentStripFacetFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
