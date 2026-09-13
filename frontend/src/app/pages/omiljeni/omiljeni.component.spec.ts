import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OmiljeniComponent } from './omiljeni.component';

describe('OmiljeniComponent', () => {
  let component: OmiljeniComponent;
  let fixture: ComponentFixture<OmiljeniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OmiljeniComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OmiljeniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
