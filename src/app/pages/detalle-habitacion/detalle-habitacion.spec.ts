import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DetalleHabitacion } from './detalle-habitacion';

describe('DetalleHabitacion', () => {
  let component: DetalleHabitacion;
  let fixture: ComponentFixture<DetalleHabitacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleHabitacion],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DetalleHabitacion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
