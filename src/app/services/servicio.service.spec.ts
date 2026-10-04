import { TestBed } from '@angular/core/testing';
import { Servicio } from '../models/servicio.model';
import { ServicioService } from './servicio.service';

describe('ServicioService', () => {
  let servicioService: ServicioService;

  // of() emite de forma síncrona, así que cada subscribe ya dejó su valor al terminar
  const nuevoServicio: Servicio = {
    nombre: 'Kayak',
    categoria: 'Aventura',
    descripcion: 'Paseo en kayak',
    imagen: '/images/Guiado.avif',
    destacado: false,
    precio: 50000,
    activo: true,
  };

  beforeEach(() => {
    servicioService = TestBed.inject(ServicioService);
  });

  it('agregarServicio asigna un id nuevo y aparece en buscarTodos', () => {
    let agregado: Servicio | undefined;
    servicioService.agregarServicio(nuevoServicio).subscribe((s) => (agregado = s));

    let todos: Servicio[] = [];
    servicioService.buscarTodos().subscribe((s) => (todos = s));

    expect(agregado?.id).toBe(7);
    expect(todos.some((s) => s.id === 7 && s.nombre === 'Kayak')).toBe(true);
  });

  it('actualizarServicio cambia el nombre', () => {
    let actualizado: Servicio | undefined;
    servicioService
      .actualizarServicio(1, { ...nuevoServicio, nombre: 'Spa renovado' })
      .subscribe((s) => (actualizado = s));

    expect(actualizado?.nombre).toBe('Spa renovado');
    expect(servicioService.obtenerPorId(1)?.nombre).toBe('Spa renovado');
  });

  it('cambiarEstado saca el servicio del catálogo activo', () => {
    servicioService.cambiarEstado(3).subscribe();

    expect(servicioService.obtenerCatalogoActivo().some((s) => s.id === 3)).toBe(false);
  });
});
