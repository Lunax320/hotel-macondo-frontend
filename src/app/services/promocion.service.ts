import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Promocion, PromocionAplicada } from '../models/promocion.model';

@Injectable({ providedIn: 'root' })
export class PromocionService {
  private http = inject(HttpClient);
  private url = environment.apiUrl + '/promociones';

  publicas(): Observable<Promocion[]> { return this.http.get<Promocion[]>(`${this.url}/publicas`); }
  todas(): Observable<Promocion[]> { return this.http.get<Promocion[]>(this.url); }
  calcular(codigo: string, fechaEntrada: string, fechaSalida: string, precioNoche: number): Observable<PromocionAplicada> {
    const params = new HttpParams().set('codigo', codigo).set('fechaEntrada', fechaEntrada)
      .set('fechaSalida', fechaSalida).set('precioNoche', precioNoche);
    return this.http.get<PromocionAplicada>(`${this.url}/calcular`, { params });
  }
  guardar(promocion: Promocion): Observable<Promocion> {
    return promocion.id ? this.http.put<Promocion>(`${this.url}/${promocion.id}`, promocion)
      : this.http.post<Promocion>(this.url, promocion);
  }
  eliminar(id: number): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
}
