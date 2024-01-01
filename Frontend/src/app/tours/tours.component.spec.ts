import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToursComponent } from './tours.component';

describe('ToursComponent', () => {
  let component: ToursComponent;
  let fixture: ComponentFixture<ToursComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ToursComponent]
    });
    fixture = TestBed.createComponent(ToursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
