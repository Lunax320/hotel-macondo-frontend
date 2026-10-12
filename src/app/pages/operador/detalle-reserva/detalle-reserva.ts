import { AsyncPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { OperadorSidebar } from '../../../components/operador-sidebar/operador-sidebar';
import { ReservaDetalleOperador } from '../../../models/reserva-detalle-operador.model';
import { ReservaService } from '../../../services/reserva.service';
import { DetalleReservaCuenta } from './components/detalle-reserva-cuenta/detalle-reserva-cuenta';
import { DetalleReservaEncabezado } from './components/detalle-reserva-encabezado/detalle-reserva-encabezado';
import { DetalleReservaHabitacion } from './components/detalle-reserva-habitacion/detalle-reserva-habitacion';
import { DetalleReservaNoEncontrada } from './components/detalle-reserva-no-encontrada/detalle-reserva-no-encontrada';
import { DetalleReservaResumen } from './components/detalle-reserva-resumen/detalle-reserva-resumen';
import { DetalleReservaCliente } from './components/detalle-reserva-cliente/detalle-reserva-cliente';

type ResultadoDetalleReserva =
  | { tipo: 'exito'; reserva: ReservaDetalleOperador }
  | { tipo: 'no-encontrada' }
  | { tipo: 'error'; mensaje: string };

@Component({
  imports: [
    AsyncPipe,
    OperadorSidebar,
    RouterLink,
    DetalleReservaCuenta,
    DetalleReservaEncabezado,
    DetalleReservaHabitacion,
    DetalleReservaNoEncontrada,
    DetalleReservaResumen,
    DetalleReservaCliente,
  ],
  selector: 'app-operador-detalle-reserva',
  templateUrl: './detalle-reserva.html',
})
export class OperadorDetalleReserva {
  private activatedRoute = inject(ActivatedRoute);
  private reservaService = inject(ReservaService);

  readonly resultadoReserva$ = this.cargarDetalle();

  private cargarDetalle() {
    const numeroReserva = this.activatedRoute.snapshot.paramMap.get('numeroReserva');
    if (!numeroReserva) {
      return of<ResultadoDetalleReserva>({ tipo: 'no-encontrada' });
    }

    return this.reservaService.obtenerDetalleOperador(numeroReserva).pipe(
      map((reserva): ResultadoDetalleReserva => ({ tipo: 'exito', reserva })),
      catchError((error: HttpErrorResponse) =>
        of<ResultadoDetalleReserva>(
          error.status === 404
            ? { tipo: 'no-encontrada' }
            : { tipo: 'error', mensaje: this.mensajeError(error) },
        ),
      ),
    );
  }

  private mensajeError(error: HttpErrorResponse): string {
    const respuesta = error.error;
    if (
      respuesta !== null &&
      typeof respuesta === 'object' &&
      'mensaje' in respuesta &&
      typeof respuesta.mensaje === 'string'
    ) {
      return respuesta.mensaje;
    }

    return error.status === 0
      ? 'No fue posible conectar con el backend. Verifica que esté ejecutándose e inténtalo de nuevo.'
      : `No fue posible cargar el detalle de la reserva (HTTP ${error.status}).`;
  }
}
