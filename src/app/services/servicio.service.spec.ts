import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Servicio } from '../models/servicio.model';
import { ServicioService } from './servicio.service';

describe('ServicioService', () => {
  let servicio: ServicioService;
  let http: HttpTestingController;
  const dato: Servicio = {
    id: 1,
    nombre: 'Spa',
    descripcion: 'Relax',
    categoria: 'Bienestar',
    destacado: false,
    precio: 100,
    activo: true,
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    servicio = TestBed.inject(ServicioService);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());
  it('lista', () => {
    servicio.buscarTodos().subscribe();
    const req = http.expectOne('http://localhost:8080/api/servicio');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });
  it('busca', () => {
    servicio.buscarPorId(1).subscribe();
    const req = http.expectOne('http://localhost:8080/api/servicio/find/1');
    expect(req.request.method).toBe('GET');
    req.flush(dato);
  });
  it('crea', () => {
    servicio.agregarServicio(dato).subscribe();
    const req = http.expectOne('http://localhost:8080/api/servicio');
    expect(req.request.method).toBe('POST');
    req.flush(dato);
  });
  it('actualiza', () => {
    servicio.actualizarServicio(1, dato).subscribe();
    const req = http.expectOne('http://localhost:8080/api/servicio');
    expect(req.request.method).toBe('PUT');
    req.flush(dato);
  });
  it('cambia estado', () => {
    servicio.cambiarEstado(1).subscribe();
    const req = http.expectOne('http://localhost:8080/api/servicio/estado/1');
    expect(req.request.method).toBe('PUT');
    req.flush(dato);
  });
  it('busca recomendaciones', () => {
    servicio.buscarRecomendaciones().subscribe();
    const req = http.expectOne('http://localhost:8080/api/servicio/recomendaciones');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });
});
