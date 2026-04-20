import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ContentStripWithTabsLibComponent } from './content-strip-with-tabs-lib.component';

describe('ContentStripWithTabsComponent', () => {
  let component: ContentStripWithTabsLibComponent;
  let fixture: ComponentFixture<ContentStripWithTabsLibComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ContentStripWithTabsLibComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentStripWithTabsLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
