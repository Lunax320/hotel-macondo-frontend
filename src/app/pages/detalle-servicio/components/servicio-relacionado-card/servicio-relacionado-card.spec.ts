import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Servicio } from '../../../../models/servicio.model';
import { ServicioRelacionadoCard } from './servicio-relacionado-card';

describe('ServicioRelacionadoCard', () => {
  let component: ServicioRelacionadoCard;
  let fixture: ComponentFixture<ServicioRelacionadoCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicioRelacionadoCard],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ServicioRelacionadoCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('servicio', {
      id: 2,
      nombre: 'Restaurante Gourmet',
      descripcion: 'La cocina caribeña elevada a su máxima expresión.',
      categoria: 'Gastronomía',
      imagen: '/images/Restaurante.avif',
      destacado: false,
      precio: 85000,
      activo: true,
    } satisfies Servicio);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
