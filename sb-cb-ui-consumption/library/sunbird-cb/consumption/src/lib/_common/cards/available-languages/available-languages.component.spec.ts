import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableLanguagesComponent } from './available-languages.component';

describe('AvailableLanguagesComponent', () => {
  let component: AvailableLanguagesComponent;
  let fixture: ComponentFixture<AvailableLanguagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AvailableLanguagesComponent]
    });
    fixture = TestBed.createComponent(AvailableLanguagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
