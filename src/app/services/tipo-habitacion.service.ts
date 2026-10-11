import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TipoHabitacion } from '../models/tipo-habitacion.model';

@Injectable({
  providedIn: 'root',
})
export class TipoHabitacionService {
  private http = inject(HttpClient);
  private url = 'http://localhost:8080/api/tipo-habitacion';

  // Obtiene todos los tipos de habitación 
  obtenerTodos(): Observable<TipoHabitacion[]> {
    return this.http.get<TipoHabitacion[]>(this.url);
  }

  // Obtiene un tipo por su identificador
  obtenerPorId(id: number): Observable<TipoHabitacion> {
    return this.http.get<TipoHabitacion>(`${this.url}/find/${id}`);
  }

  listarTipos(): Observable<TipoHabitacion[]> {
    return this.obtenerTodos();
  }

  agregarTipo(tipo: TipoHabitacion): Observable<TipoHabitacion> {
    return this.http.post<TipoHabitacion>(this.url, tipo);
  }

  actualizarTipo(tipo: TipoHabitacion): Observable<TipoHabitacion> {
    return this.http.put<TipoHabitacion>(this.url, tipo);
  }

  eliminarTipo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/delete/${id}`);
  }
}