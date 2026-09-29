import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TipoHabitacion } from '../../../../models/tipo-habitacion.model';
import { ResumenReservaHabitacion } from './resumen-reserva-habitacion';

describe('ResumenReservaHabitacion', () => {
  let component: ResumenReservaHabitacion;
  let fixture: ComponentFixture<ResumenReservaHabitacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumenReservaHabitacion],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ResumenReservaHabitacion);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('tipoHabitacion', {
      id: 1,
      nombre: 'Castaño Fundacional',
      descripcion: 'Refugio íntimo con vista al gran patio de Macondo.',
      imagen: '/images/HabitacionNormal.avif',
      precioNoche: 280000,
      capacidadPersonas: 2,
    } satisfies TipoHabitacion);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
