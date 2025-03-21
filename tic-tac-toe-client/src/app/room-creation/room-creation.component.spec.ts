import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomCreationComponent } from './room-creation.component';

describe('RoomCreationComponent', () => {
  let component: RoomCreationComponent;
  let fixture: ComponentFixture<RoomCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomCreationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
