import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { OperadorService } from './operador.service';

describe('OperadorService', () => {
  let servicio: OperadorService;
  let http: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    servicio = TestBed.inject(OperadorService);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());
  it('realiza sus solicitudes HTTP', () => {
    servicio.listar().subscribe();
    let req = http.expectOne('http://localhost:8080/api/operador');
    expect(req.request.method).toBe('GET');
    req.flush([]);
    servicio.agregar({ nombre: 'Ana', activo: true }).subscribe();
    req = http.expectOne('http://localhost:8080/api/operador');
    expect(req.request.method).toBe('POST');
    req.flush({});
    servicio.cambiarEstado(1).subscribe();
    req = http.expectOne('http://localhost:8080/api/operador/estado/1');
    expect(req.request.method).toBe('PUT');
    req.flush({});
    servicio.eliminar(1).subscribe();
    req = http.expectOne('http://localhost:8080/api/operador/delete/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
