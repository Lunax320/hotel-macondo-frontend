import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ComentarioCliente, ComentarioPublico, ComentarioSolicitud } from '../models/comentario.model';

// Comentarios de huéspedes: crear (cliente), listar publicados (landing) y publicar (admin).
@Injectable({ providedIn: 'root' })
export class ComentarioService {
  private url = 'http://localhost:8080/api/comentario';

  private http = inject(HttpClient);

  // Crea un comentario sobre una estadía finalizada del propio cliente.
  crear(solicitud: ComentarioSolicitud): Observable<ComentarioPublico> {
    return this.http.post<ComentarioPublico>(this.url, solicitud);
  }

  // Lista los comentarios que el administrador ya publicó.
  publicados(): Observable<ComentarioPublico[]> {
    return this.http.get<ComentarioPublico[]>(`${this.url}/publicados`);
  }

  // Comentarios del cliente, para su historial.
  delCliente(clienteId: number): Observable<ComentarioCliente[]> {
    return this.http.get<ComentarioCliente[]>(`${this.url}/cliente/${clienteId}`);
  }

  // Edita el comentario propio; vuelve a pendiente de publicación.
  actualizar(id: number, clienteId: number, cuerpo: { calificacion: number; texto: string }): Observable<ComentarioCliente> {
    return this.http.put<ComentarioCliente>(`${this.url}/${id}?clienteId=${clienteId}`, cuerpo);
  }

  // Elimina el comentario propio (204 sin cuerpo).
  eliminar(id: number, clienteId: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}?clienteId=${clienteId}`);
  }

  // Publica un comentario (uso administrador).
  publicar(id: number): Observable<ComentarioPublico> {
    return this.http.put<ComentarioPublico>(`${this.url}/${id}/publicar`, {});
  }
}
