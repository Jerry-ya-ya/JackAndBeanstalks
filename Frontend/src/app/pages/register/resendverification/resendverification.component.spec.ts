import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResendverificationComponent } from './resendverification.component';

describe('ResendverificationComponent', () => {
  let component: ResendverificationComponent;
  let fixture: ComponentFixture<ResendverificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResendverificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResendverificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
