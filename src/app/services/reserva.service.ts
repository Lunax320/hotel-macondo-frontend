import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConsumoServicioSolicitud } from '../models/consumo-servicio-solicitud.model';
import { Habitacion } from '../models/habitacion.model';
import { Reserva } from '../models/reserva.model';
import { ReservaDetalleOperador } from '../models/reserva-detalle-operador.model';
import { ReservaIdentificadorResponse } from '../models/reserva-identificador-response.model';
import { ReservaOperador } from '../models/reserva-operador.model';
import { ReservaSolicitud } from '../models/reserva-solicitud.model';
import { Pago } from '../models/pago.model';

@Injectable({ providedIn: 'root' })
export class ReservaService {
  private url = 'http://localhost:8080/api/reserva';
  private operadorUrl = 'http://localhost:8080/api/operador';

  constructor(private http: HttpClient) {}

  obtenerReservasOperador(): Observable<ReservaOperador[]> {
    return this.http.get<ReservaOperador[]>(this.url);
  }

  obtenerDetalleOperador(numeroReserva: string): Observable<ReservaDetalleOperador> {
    return this.http.get<ReservaDetalleOperador>(
      `${this.url}/${encodeURIComponent(numeroReserva)}`,
    );
  }

  obtenerDetalleOperadorPorId(reservaId: number): Observable<ReservaDetalleOperador> {
    return this.http.get<ReservaDetalleOperador>(
      `${this.url}/id/${encodeURIComponent(String(reservaId))}`,
    );
  }

  obtenerReservaActualPorHabitacion(
    numeroHabitacion: string | number,
  ): Observable<ReservaIdentificadorResponse> {
    return this.http.get<ReservaIdentificadorResponse>(
      `${this.url}/habitacion/${encodeURIComponent(String(numeroHabitacion))}/actual`,
    );
  }

  cancelarReservaOperador(numeroReserva: string): Observable<ReservaOperador> {
    return this.http.put<ReservaOperador>(
      `${this.url}/${encodeURIComponent(numeroReserva)}/cancelar`,
      {},
    );
  }

  activarReservaOperador(numeroReserva: string): Observable<ReservaOperador> {
    return this.http.put<ReservaOperador>(
      `${this.url}/${encodeURIComponent(numeroReserva)}/activar`,
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

  agregarServiciosAReserva(
    numeroReserva: string,
    servicios: ConsumoServicioSolicitud[],
  ): Observable<void> {
    return this.http.post<void>(
      `${this.operadorUrl}/cuenta/reserva/${encodeURIComponent(numeroReserva)}/servicios`,
      servicios,
    );
  }

  pagarCuentaReserva(numeroReserva: string, metodoPago: string): Observable<Pago> {
    return this.http.post<Pago>(
      `${this.operadorUrl}/cuenta/reserva/${encodeURIComponent(numeroReserva)}/pago`,
      { metodoPago },
    );
  }

  finalizarReservaOperador(numeroReserva: string): Observable<ReservaOperador> {
    return this.http.put<ReservaOperador>(
      `${this.url}/${encodeURIComponent(numeroReserva)}/finalizar`,
      {},
    );
  }
}
