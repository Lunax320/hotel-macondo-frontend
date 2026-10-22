import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Habitacion } from '../models/habitacion.model';
import { Reserva } from '../models/reserva.model';
import { ReservaDetalleOperador } from '../models/reserva-detalle-operador.model';
import { ReservaOperador } from '../models/reserva-operador.model';
import { ReservaSolicitud } from '../models/reserva-solicitud.model';

@Injectable({ providedIn: 'root' })
export class ReservaService {
  private url = 'http://localhost:8080/api/reserva';

  constructor(private http: HttpClient) {}

  obtenerReservasOperador(): Observable<ReservaOperador[]> {
    return this.http.get<ReservaOperador[]>(this.url);
  }

  obtenerDetalleOperador(numeroReserva: string): Observable<ReservaDetalleOperador> {
    return this.http.get<ReservaDetalleOperador>(
      `${this.url}/${encodeURIComponent(numeroReserva)}`,
    );
  }

  cancelarReservaOperador(numeroReserva: string): Observable<ReservaOperador> {
    return this.http.put<ReservaOperador>(
      `${this.url}/${encodeURIComponent(numeroReserva)}/cancelar`,
      {},
    );
  }

  buscarActivasPorCliente(clienteId: number): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${this.url}/cliente/${clienteId}/activas`);
  }

  buscarHistorialPorCliente(clienteId: number): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${this.url}/cliente/${clienteId}/historial`);
  }

  obtenerParaEditar(clienteId: number, reservaId: number): Observable<Reserva> {
    return this.http.get<Reserva>(`${this.url}/cliente/${clienteId}/find/${reservaId}`);
  }

  consultarDisponibilidad(
    clienteId: number,
    tipoId: number,
    datos: ReservaSolicitud,
    reservaId?: number,
  ): Observable<Habitacion[]> {
    const params: { [nombre: string]: string | number } = {
      tipoId,
      fechaEntrada: datos.fechaInicio,
      fechaSalida: datos.fechaFin,
      cantidadPersonas: datos.cantidadPersonas,
    };
    if (reservaId !== undefined) {
      params['reservaId'] = reservaId;
    }
    return this.http.get<Habitacion[]>(`${this.url}/cliente/${clienteId}/disponibilidad`, {
      params,
    });
  }

  crear(clienteId: number, tipoId: number, datos: ReservaSolicitud): Observable<Reserva> {
    return this.http.post<Reserva>(`${this.url}/cliente/${clienteId}`, datos, {
      params: { tipoId },
    });
  }

  modificar(
    clienteId: number,
    reservaId: number,
    tipoId: number,
    datos: ReservaSolicitud,
  ): Observable<Reserva> {
    return this.http.put<Reserva>(`${this.url}/cliente/${clienteId}/${reservaId}`, datos, {
      params: { tipoId },
    });
  }

  cancelar(clienteId: number, reservaId: number): Observable<Reserva> {
    return this.http.put<Reserva>(`${this.url}/cliente/${clienteId}/${reservaId}/cancelar`, {});
  }
}
