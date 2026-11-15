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

  // Obtiene el catálogo activo que se utiliza en la vista pública.
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

  // Consulta los servicios recomendados por el backend.
  buscarRecomendaciones(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${this.url}/recomendaciones`);
  }

  // Obtiene todos los servicios para la administración.
  buscarTodos(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(this.url);
  }

  // Busca un servicio por su identificador.
  buscarPorId(id: number): Observable<Servicio> {
    return this.http.get<Servicio>(`${this.url}/find/${id}`);
  }

  // Envía un nuevo servicio para su creación.
  agregarServicio(servicio: Servicio): Observable<Servicio> {
    return this.http.post<Servicio>(this.url, servicio);
  }

  // Actualiza el servicio y conserva el identificador indicado.
  actualizarServicio(id: number, servicio: Servicio): Observable<Servicio> {
    return this.http.put<Servicio>(this.url, { ...servicio, id });
  }

  // Solicita al backend alternar el estado del servicio.
  cambiarEstado(id: number): Observable<Servicio> {
    return this.http.put<Servicio>(`${this.url}/estado/${id}`, {});
  }
}