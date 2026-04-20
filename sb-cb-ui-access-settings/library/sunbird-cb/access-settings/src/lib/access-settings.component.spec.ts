import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { AccessSettingsComponent } from "./access-settings.component";

describe("AccessSettingsComponent", () => {
  let component: AccessSettingsComponent;
  let fixture: ComponentFixture<AccessSettingsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AccessSettingsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
