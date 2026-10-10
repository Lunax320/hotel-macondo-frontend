import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ReservaService } from './reserva.service';

describe('ReservaService', () => {
  let servicio: ReservaService;
  let http: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    servicio = TestBed.inject(ReservaService);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());
  it('busca reservas activas por cliente', () => {
    servicio.buscarActivasPorCliente(1).subscribe();
    const solicitud = http.expectOne('http://localhost:8080/api/reserva/cliente/1/activas');
    expect(solicitud.request.method).toBe('GET');
    solicitud.flush([]);
  });
  it('busca el historial por cliente', () => {
    servicio.buscarHistorialPorCliente(1).subscribe();
    const solicitud = http.expectOne('http://localhost:8080/api/reserva/cliente/1/historial');
    expect(solicitud.request.method).toBe('GET');
    solicitud.flush([]);
  });
});
