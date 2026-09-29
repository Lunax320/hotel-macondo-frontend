import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Servicio } from '../../../../models/servicio.model';
import { ServicioCard } from './servicio-card';

describe('ServicioCard', () => {
  let component: ServicioCard;
  let fixture: ComponentFixture<ServicioCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicioCard],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ServicioCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('servicio', {
      id: 1,
      nombre: 'Spa & Bienestar',
      descripcion: 'Experiencia sensorial de relajación profunda.',
      categoria: 'Bienestar',
      imagen: '/images/Spa.avif',
      destacado: true,
      precio: 120000,
      activo: true,
      duracion: '60-90 min',
      incluidos: ['Masaje de 60 min'],
    } satisfies Servicio);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
