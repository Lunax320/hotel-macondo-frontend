import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TipoHabitacionService } from './tipo-habitacion.service';

describe('TipoHabitacionService', () => {
  let servicio: TipoHabitacionService;
  let http: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    servicio = TestBed.inject(TipoHabitacionService);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());
  it('realiza sus solicitudes HTTP', () => {
    const tipo = {
      id: 1,
      nombre: 'Suite',
      descripcion: 'Amplia',
      precioNoche: 100,
      capacidadPersonas: 2,
    };
    servicio.listarTipos().subscribe();
    let req = http.expectOne('http://localhost:8080/api/tipo-habitacion');
    expect(req.request.method).toBe('GET');
    req.flush([]);
    servicio.agregarTipo({ ...tipo, id: undefined }).subscribe();
    req = http.expectOne('http://localhost:8080/api/tipo-habitacion');
    expect(req.request.method).toBe('POST');
    req.flush(tipo);
    servicio.actualizarTipo(tipo).subscribe();
    req = http.expectOne('http://localhost:8080/api/tipo-habitacion');
    expect(req.request.method).toBe('PUT');
    req.flush(tipo);
    servicio.eliminarTipo(1).subscribe();
    req = http.expectOne('http://localhost:8080/api/tipo-habitacion/delete/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
