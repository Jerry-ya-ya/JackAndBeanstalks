import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutwebsiteComponent } from './aboutwebsite.component';

describe('AboutwebsiteComponent', () => {
  let component: AboutwebsiteComponent;
  let fixture: ComponentFixture<AboutwebsiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AboutwebsiteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutwebsiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
