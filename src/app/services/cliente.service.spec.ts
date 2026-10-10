import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ClienteService } from './cliente.service';

describe('ClienteService', () => {
  let servicio: ClienteService;
  let http: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    servicio = TestBed.inject(ClienteService);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());
  it('busca un cliente por id', () => {
    servicio.buscarPorId(7).subscribe((cliente) => expect(cliente.nombre).toBe('Ana'));
    const solicitud = http.expectOne('http://localhost:8080/api/cliente/find/7');
    expect(solicitud.request.method).toBe('GET');
    solicitud.flush({ id: 7, nombre: 'Ana' });
  });
  it('registra el cliente con su contraseña', () => {
    const cliente = {
      nombre: 'Ana',
      apellido: 'Ríos',
      cedula: '1',
      telefono: '3000000',
      correo: 'ana@macondo.com',
    };
    servicio.registrar(cliente, 'secreta').subscribe();
    const solicitud = http.expectOne('http://localhost:8080/api/cliente/registro');
    expect(solicitud.request.body).toEqual({ cliente, contrasena: 'secreta' });
    solicitud.flush({ ...cliente, id: 8 });
  });
});
