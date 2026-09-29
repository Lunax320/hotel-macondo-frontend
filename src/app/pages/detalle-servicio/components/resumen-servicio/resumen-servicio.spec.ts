import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Servicio } from '../../../../models/servicio.model';
import { ResumenServicio } from './resumen-servicio';

describe('ResumenServicio', () => {
  let component: ResumenServicio;
  let fixture: ComponentFixture<ResumenServicio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumenServicio],
    }).compileComponents();

    fixture = TestBed.createComponent(ResumenServicio);
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
      horario: 'Lunes a domingo: 8:00 a.m. - 8:00 p.m.',
      incluidos: ['Masaje', 'Aromaterapia', 'Baño de vapor', 'Infusión', 'Cabina privada'],
    } satisfies Servicio);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
