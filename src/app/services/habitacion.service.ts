import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Habitacion } from '../models/habitacion.model';
import { TipoHabitacion } from '../models/tipo-habitacion.model';

@Injectable({
  providedIn: 'root',
})
export class HabitacionService {
  private http = inject(HttpClient);
  private url = 'http://localhost:8080/api/habitacion';

  hayDisponibilidadPorTipo(tipoHabitacion: TipoHabitacion): boolean {
    // Si el tipo existe y tiene capacidad configurada se asume disponible
    return tipoHabitacion && tipoHabitacion.capacidadPersonas > 0;
  }

  // Lista las habitaciones desde la API REST
  listarHabitaciones(): Observable<Habitacion[]> {
    return this.http.get<Habitacion[]>(this.url);
  }

  // Consulta la habitación correspondiente al identificador indicado.
  buscarHabitacionPorId(id: number): Observable<Habitacion> {
    return this.http.get<Habitacion>(`${this.url}/find/${id}`);
  }

  // Envía al backend una nueva habitación para su creación.
  agregarHabitacion(habitacion: Habitacion): Observable<Habitacion> {
    return this.http.post<Habitacion>(this.url, habitacion);
  }

  // Envía al backend los datos actualizados de la habitación.
  actualizarHabitacion(habitacion: Habitacion): Observable<Habitacion> {
    return this.http.put<Habitacion>(this.url, habitacion);
  }

  // Solicita al backend alternar el estado de la habitación.
  cambiarEstadoHabitacion(id: number): Observable<Habitacion> {
    return this.http.put<Habitacion>(`${this.url}/estado/${id}`, {});
  }

  // Solicita la eliminación de la habitación indicada.
  eliminarHabitacion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/delete/${id}`);
  }

  // Consulta la habitación asociada a una reserva.
  buscarPorReserva(reservaId: number): Observable<Habitacion> {
    return this.http.get<Habitacion>(`${this.url}/reserva/${reservaId}`);
  }
}