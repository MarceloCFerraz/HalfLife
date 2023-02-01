import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MountProtocolComponent } from './mount-protocol.component';

describe('MountProtocolComponent', () => {
  let component: MountProtocolComponent;
  let fixture: ComponentFixture<MountProtocolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MountProtocolComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MountProtocolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
