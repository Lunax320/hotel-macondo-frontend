import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Servicio } from '../models/servicio.model';

@Injectable({
  providedIn: 'root',
})
export class ServicioService {
  private http = inject(HttpClient);
  private url = 'http://localhost:8080/api/servicio';

  // Catálogo activo (Landing, Servicios)
  obtenerCatalogoActivo(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${this.url}/catalogo`);
  }

  obtenerTodos(): Observable<Servicio[]> {
    return this.obtenerCatalogoActivo();
  }

  // Busca un servicio por su identificador
  obtenerPorId(id: number): Observable<Servicio> {
    return this.http.get<Servicio>(`${this.url}/find/${id}`);
  }

  // Busca servicios relacionados para el detalle
  obtenerRelacionados(id: number): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${this.url}/relacionados/${id}`);
  }

  buscarRecomendaciones(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${this.url}/recomendaciones`);
  }

  buscarTodos(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(this.url);
  }

  buscarPorId(id: number): Observable<Servicio> {
    return this.http.get<Servicio>(`${this.url}/find/${id}`);
  }

  agregarServicio(servicio: Servicio): Observable<Servicio> {
    return this.http.post<Servicio>(this.url, servicio);
  }

  actualizarServicio(id: number, servicio: Servicio): Observable<Servicio> {
    return this.http.put<Servicio>(this.url, { ...servicio, id });
  }

  cambiarEstado(id: number): Observable<Servicio> {
    return this.http.put<Servicio>(`${this.url}/estado/${id}`, {});
  }
}