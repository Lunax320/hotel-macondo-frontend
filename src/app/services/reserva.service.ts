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
import { PagoCliente } from '../models/pago-cliente.model';

@Injectable({ providedIn: 'root' })
export class ReservaService {
  private url = 'http://localhost:8080/api/reserva';
  private operadorUrl = 'http://localhost:8080/api/operador';

  constructor(private http: HttpClient) {}

  // Obtiene las reservas visibles para la operación del hotel.
  obtenerReservasOperador(): Observable<ReservaOperador[]> {
    return this.http.get<ReservaOperador[]>(this.url);
  }

  // Busca el detalle de una reserva por su número de reserva.
  obtenerDetalleOperador(numeroReserva: string): Observable<ReservaDetalleOperador> {
    return this.http.get<ReservaDetalleOperador>(
      `${this.url}/${encodeURIComponent(numeroReserva)}`,
    );
  }

  // Busca el detalle de una reserva por su identificador interno.
  obtenerDetalleOperadorPorId(reservaId: number): Observable<ReservaDetalleOperador> {
    return this.http.get<ReservaDetalleOperador>(
      `${this.url}/id/${encodeURIComponent(String(reservaId))}`,
    );
  }

  // Obtiene el identificador de la reserva actual de una habitación.
  obtenerReservaActualPorHabitacion(
    numeroHabitacion: string | number,
  ): Observable<ReservaIdentificadorResponse> {
    return this.http.get<ReservaIdentificadorResponse>(
      `${this.url}/habitacion/${encodeURIComponent(String(numeroHabitacion))}/actual`,
    );
  }

  // Solicita cancelar una reserva desde el flujo del operador.
  cancelarReservaOperador(numeroReserva: string): Observable<ReservaOperador> {
    return this.http.put<ReservaOperador>(
      `${this.url}/${encodeURIComponent(numeroReserva)}/cancelar`,
      {},
    );
  }

  // Solicita activar una reserva desde el flujo del operador.
  activarReservaOperador(numeroReserva: string): Observable<ReservaOperador> {
    return this.http.put<ReservaOperador>(
      `${this.url}/${encodeURIComponent(numeroReserva)}/activar`,
      {},
    );
  }

  // Obtiene las reservas activas asociadas al cliente.
  buscarActivasPorCliente(clienteId: number): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${this.url}/cliente/${clienteId}/activas`);
  }

  // Obtiene el historial de reservas del cliente.
  buscarHistorialPorCliente(clienteId: number): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${this.url}/cliente/${clienteId}/historial`);
  }

  // Obtiene los datos de una reserva del cliente para precargar su edición.
  obtenerParaEditar(clienteId: number, reservaId: number): Observable<Reserva> {
    return this.http.get<Reserva>(`${this.url}/cliente/${clienteId}/find/${reservaId}`);
  }

  // Consulta habitaciones disponibles para las fechas, capacidad y tipo indicados; incluye el identificador de reserva si se edita.
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

  // Envía los datos para crear una reserva del cliente con el tipo seleccionado.
  crear(clienteId: number, tipoId: number, datos: ReservaSolicitud): Observable<Reserva> {
    return this.http.post<Reserva>(`${this.url}/cliente/${clienteId}`, datos, {
      params: { tipoId },
    });
  }

  // Envía los cambios de una reserva existente del cliente.
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

  // Solicita cancelar una reserva perteneciente al cliente.
  cancelar(clienteId: number, reservaId: number): Observable<Reserva> {
    return this.http.put<Reserva>(`${this.url}/cliente/${clienteId}/${reservaId}/cancelar`, {});
  }

  // Agrega los consumos de servicios a la cuenta asociada a la reserva.
  agregarServiciosAReserva(
    numeroReserva: string,
    servicios: ConsumoServicioSolicitud[],
  ): Observable<void> {
    return this.http.post<void>(
      `${this.operadorUrl}/cuenta/reserva/${encodeURIComponent(numeroReserva)}/servicios`,
      servicios,
    );
  }

  // Busca la reserva activa de la habitación para el check-out (aunque la cuenta ya esté pagada)
  obtenerReservaCheckoutPorHabitacion(
    numeroHabitacion: string | number,
  ): Observable<ReservaIdentificadorResponse> {
    return this.http.get<ReservaIdentificadorResponse>(
      `${this.url}/habitacion/${encodeURIComponent(String(numeroHabitacion))}/checkout`,
    );
  }

  // Paga el total de la cuenta de la reserva con el método elegido
  pagarCuentaReserva(numeroReserva: string, metodoPago: string): Observable<Pago> {
    return this.http.post<Pago>(
      `${this.operadorUrl}/cuenta/reserva/${encodeURIComponent(numeroReserva)}/pago`,
      { metodoPago },
    );
  }

  // Finaliza la estadía (el backend exige la cuenta pagada)
  finalizarReservaOperador(numeroReserva: string): Observable<ReservaOperador> {
    return this.http.put<ReservaOperador>(
      `${this.url}/${encodeURIComponent(numeroReserva)}/finalizar`,
      {},
    );
  }

  // Elimina un servicio guardado de la cuenta de la reserva
  eliminarServicioDeReserva(numeroReserva: string, detalleId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.operadorUrl}/cuenta/reserva/${encodeURIComponent(numeroReserva)}/servicios/${detalleId}`,
    );
  }

  // Busca el historial de pagos de un cliente
  buscarPagosPorCliente(clienteId: number): Observable<PagoCliente[]> {
    return this.http.get<PagoCliente[]>(`${this.url}/cliente/${clienteId}/pagos`);
  }
}
