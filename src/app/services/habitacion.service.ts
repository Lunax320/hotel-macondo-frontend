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

  buscarHabitacionPorId(id: number): Observable<Habitacion> {
    return this.http.get<Habitacion>(`${this.url}/find/${id}`);
  }

  agregarHabitacion(habitacion: Habitacion): Observable<Habitacion> {
    return this.http.post<Habitacion>(this.url, habitacion);
  }

  actualizarHabitacion(habitacion: Habitacion): Observable<Habitacion> {
    return this.http.put<Habitacion>(this.url, habitacion);
  }

  cambiarEstadoHabitacion(id: number): Observable<Habitacion> {
    return this.http.put<Habitacion>(`${this.url}/estado/${id}`, {});
  }

  eliminarHabitacion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/delete/${id}`);
  }

  buscarPorReserva(reservaId: number): Observable<Habitacion> {
    return this.http.get<Habitacion>(`${this.url}/reserva/${reservaId}`);
  }
}