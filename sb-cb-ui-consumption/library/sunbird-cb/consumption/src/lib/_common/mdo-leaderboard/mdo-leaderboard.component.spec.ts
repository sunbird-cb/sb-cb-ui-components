import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MdoLeaderboardComponent } from './mdo-leaderboard.component';

describe('MdoLeaderboardComponent', () => {
  let component: MdoLeaderboardComponent;
  let fixture: ComponentFixture<MdoLeaderboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MdoLeaderboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MdoLeaderboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
