import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Habitaciones } from './habitaciones';

describe('Habitaciones', () => {
  let component: Habitaciones;
  let fixture: ComponentFixture<Habitaciones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Habitaciones],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Habitaciones);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
