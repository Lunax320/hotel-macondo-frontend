import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Operador } from '../models/operador.model';

// Gestiona los operadores administrativos mediante la API REST.
@Injectable({ providedIn: 'root' })
export class OperadorService {
  private http = inject(HttpClient);
  private url = 'http://localhost:8080/api/operador';

  // Lista todos los operadores.
  listar(): Observable<Operador[]> {
    return this.http.get<Operador[]>(this.url);
  }

  // Crea un operador.
  agregar(operador: Operador): Observable<Operador> {
    return this.http.post<Operador>(this.url, operador);
  }

  // Alterna el estado de un operador.
  cambiarEstado(id: number): Observable<Operador> {
    return this.http.put<Operador>(`${this.url}/estado/${id}`, {});
  }

  // Elimina un operador.
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/delete/${id}`);
  }
}
