import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Habitacion } from '../models/habitacion.model';
import { TipoHabitacion } from '../models/tipo-habitacion.model';
import { TipoHabitacionService } from './tipo-habitacion.service';

// Servicio para operaciones de habitación (catálogo local + backend para reserva).
@Injectable({
  providedIn: 'root',
})
export class HabitacionService {
  private http = inject(HttpClient);
  private tipoHabitacionArray = inject(TipoHabitacionService).obtenerTodos();
  private url = 'http://localhost:8080/api/habitacion';

  private habitacionArray: Habitacion[] = Array.from({ length: 50 }, (_, i) => {
    const id = i + 1;
    const piso = Math.floor(i / 10) + 1;
    const hab = (i % 10) + 1;
    const numero = `${piso}${hab < 10 ? '0' + hab : hab}`;
    const tipoHabitacion = this.tipoHabitacionArray.find((tipo) => tipo.id === piso);

    if (!tipoHabitacion) {
      throw new Error(`No existe el tipo de habitación ${piso}.`);
    }

    const etiquetas = ['ACOGEDORA', 'POPULAR', 'EXCLUSIVA', 'HISTÓRICA', 'ÚNICA'];

    return {
      id,
      numero,
      nombre: `Habitación ${numero}`,
      estado: 'DISPONIBLE',
      capacidad: tipoHabitacion.capacidadPersonas,
      precio: tipoHabitacion.precioNoche,
      etiqueta: etiquetas[piso - 1],
      piso,
      tipoHabitacion,
    };
  });

  // Indica si hay alguna habitacion disponible del tipo (lo usa detalle-habitacion, datos locales).
  hayDisponibilidadPorTipo(tipoHabitacion: TipoHabitacion): boolean {
    return this.habitacionArray.some(
      (habitacion) =>
        habitacion.tipoHabitacion.id === tipoHabitacion.id && habitacion.estado === 'DISPONIBLE',
    );
  }

  // Lista las habitaciones para el panel administrativo.
  listarHabitaciones(): Observable<Habitacion[]> {
    return this.http.get<Habitacion[]>(this.url);
  }

  // Busca una habitación administrativa por identificador.
  buscarHabitacionPorId(id: number): Observable<Habitacion> {
    return this.http.get<Habitacion>(`${this.url}/find/${id}`);
  }

  // Crea una habitación.
  agregarHabitacion(habitacion: Habitacion): Observable<Habitacion> {
    return this.http.post<Habitacion>(this.url, habitacion);
  }

  // Actualiza una habitación existente.
  actualizarHabitacion(habitacion: Habitacion): Observable<Habitacion> {
    return this.http.put<Habitacion>(this.url, habitacion);
  }

  // Alterna la disponibilidad de una habitación.
  cambiarEstadoHabitacion(id: number): Observable<Habitacion> {
    return this.http.put<Habitacion>(`${this.url}/estado/${id}`, {});
  }

  // Elimina una habitación sin reservas asociadas.
  eliminarHabitacion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/delete/${id}`);
  }

  // Busca habitación por id de reserva (backend).
  buscarPorReserva(reservaId: number): Observable<Habitacion> {
    return this.http.get<Habitacion>(`${this.url}/reserva/${reservaId}`);
  }
}
