import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MemberCardComponent } from './member-card.component';

describe('MemberCardComponent', () => {
  let component: MemberCardComponent;
  let fixture: ComponentFixture<MemberCardComponent>;

  // Sample member data for testing
  const mockMemberData = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should properly initialize with default values', () => {
    expect(component.memeberData).toBeUndefined();
  });

  it('should set memberData input property', () => {
    // Arrange
    component.memeberData = mockMemberData;

    // Act
    fixture.detectChanges();

    // Assert
    expect(component.memeberData).toEqual(mockMemberData);
  });

  it('should properly handle null memberData', () => {
    // Arrange
    component.memeberData = null;

    // Act
    fixture.detectChanges();

    // Assert
    expect(component.memeberData).toBeNull();
  });

  // Test for ngOnInit lifecycle hook
  it('should initialize component through ngOnInit', () => {
    // Arrange
    spyOn(component, 'ngOnInit').and.callThrough();

    // Act
    component.ngOnInit();

    // Assert
    expect(component.ngOnInit).toHaveBeenCalled();
  });
});