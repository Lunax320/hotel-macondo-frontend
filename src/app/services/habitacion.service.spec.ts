import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HabitacionService } from './habitacion.service';

describe('HabitacionService', () => {
  it('realiza el CRUD administrativo HTTP', () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    const servicio = TestBed.inject(HabitacionService);
    const http = TestBed.inject(HttpTestingController);
    const habitacion = {
      id: 1,
      numero: '101',
      nombre: 'Suite',
      estado: 'DISPONIBLE',
      capacidad: 2,
      precio: 100,
      tipoHabitacion: {
        id: 1,
        nombre: 'Suite',
        descripcion: 'Amplia',
        precioNoche: 100,
        capacidadPersonas: 2,
      },
    };
    servicio.listarHabitaciones().subscribe();
    let solicitud = http.expectOne('http://localhost:8080/api/habitacion');
    expect(solicitud.request.method).toBe('GET');
    solicitud.flush([]);
    servicio.buscarHabitacionPorId(1).subscribe();
    solicitud = http.expectOne('http://localhost:8080/api/habitacion/find/1');
    expect(solicitud.request.method).toBe('GET');
    solicitud.flush(habitacion);
    servicio.agregarHabitacion({ ...habitacion, id: undefined }).subscribe();
    solicitud = http.expectOne('http://localhost:8080/api/habitacion');
    expect(solicitud.request.method).toBe('POST');
    solicitud.flush(habitacion);
    servicio.actualizarHabitacion(habitacion).subscribe();
    solicitud = http.expectOne('http://localhost:8080/api/habitacion');
    expect(solicitud.request.method).toBe('PUT');
    solicitud.flush(habitacion);
    servicio.cambiarEstadoHabitacion(1).subscribe();
    solicitud = http.expectOne('http://localhost:8080/api/habitacion/estado/1');
    expect(solicitud.request.method).toBe('PUT');
    solicitud.flush(habitacion);
    servicio.eliminarHabitacion(1).subscribe();
    solicitud = http.expectOne('http://localhost:8080/api/habitacion/delete/1');
    expect(solicitud.request.method).toBe('DELETE');
    solicitud.flush(null);
    http.verify();
  });

  it('busca la habitación asociada a una reserva', () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    const servicio = TestBed.inject(HabitacionService);
    const http = TestBed.inject(HttpTestingController);
    servicio.buscarPorReserva(3).subscribe((habitacion) => expect(habitacion.numero).toBe('101'));
    const solicitud = http.expectOne('http://localhost:8080/api/habitacion/reserva/3');
    expect(solicitud.request.method).toBe('GET');
    solicitud.flush({ id: 1, numero: '101' });
    http.verify();
  });
});
