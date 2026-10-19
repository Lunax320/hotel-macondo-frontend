import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { OperadorSidebar } from '../../../components/operador-sidebar/operador-sidebar';
import { ReservaDetalleOperador } from '../../../models/reserva-detalle-operador.model';
import { ReservaService } from '../../../services/reserva.service';
import { DetalleReservaCuenta } from './components/detalle-reserva-cuenta/detalle-reserva-cuenta';
import { DetalleReservaEncabezado } from './components/detalle-reserva-encabezado/detalle-reserva-encabezado';
import { DetalleReservaHabitacion } from './components/detalle-reserva-habitacion/detalle-reserva-habitacion';
import { DetalleReservaNoEncontrada } from './components/detalle-reserva-no-encontrada/detalle-reserva-no-encontrada';
import { DetalleReservaResumen } from './components/detalle-reserva-resumen/detalle-reserva-resumen';
import { DetalleReservaCliente } from './components/detalle-reserva-cliente/detalle-reserva-cliente';

@Component({
  imports: [
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
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class OperadorDetalleReserva implements OnInit, OnDestroy {
  private activatedRoute = inject(ActivatedRoute);
  private reservaService = inject(ReservaService);
  private cambiosRuta?: Subscription;
  private carga?: Subscription;

  reserva?: ReservaDetalleOperador;
  cargando = true;
  noEncontrada = false;
  errorCarga = '';

  ngOnInit(): void {
    this.cambiosRuta = this.activatedRoute.paramMap.subscribe(() => this.cargarDetalle());
  }

  ngOnDestroy(): void {
    this.cambiosRuta?.unsubscribe();
    this.carga?.unsubscribe();
  }

  cargarDetalle(): void {
    this.carga?.unsubscribe();
    this.reserva = undefined;
    this.noEncontrada = false;
    this.errorCarga = '';
    this.cargando = true;
    const numeroReserva = this.activatedRoute.snapshot.paramMap.get('numeroReserva');
    if (!numeroReserva?.trim()) {
      this.noEncontrada = true;
      this.cargando = false;
      return;
    }

    // Una sola consulta: la respuesta ya contiene cliente, habitación y cuenta.
    this.carga = this.reservaService.obtenerDetalleOperador(numeroReserva).subscribe({
      next: (reserva) => {
        this.reserva = reserva;
        this.cargando = false;
      },
      error: (error: HttpErrorResponse) => {
        this.noEncontrada = error.status === 404;
        this.errorCarga = this.noEncontrada ? '' : this.mensajeError(error);
        this.cargando = false;
      },
    });
  }

  private mensajeError(error: HttpErrorResponse): string {
    const respuesta: unknown = error.error;
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
