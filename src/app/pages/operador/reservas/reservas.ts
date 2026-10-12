import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { OperadorSidebar } from '../../../components/operador-sidebar/operador-sidebar';
import { ReservaOperador } from '../../../models/reserva-operador.model';
import { ReservaService } from '../../../services/reserva.service';
import { ReservasEstadisticas } from './components/reservas-estadisticas/reservas-estadisticas';
import { ReservasTabla } from './components/reservas-tabla/reservas-tabla';

@Component({
  imports: [OperadorSidebar, ReservasEstadisticas, ReservasTabla],
  selector: 'app-operador-reservas',
  styleUrl: './reservas.scss',
  templateUrl: './reservas.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class OperadorReservas implements OnInit {
  private reservaService = inject(ReservaService);

  reservas: ReservaOperador[] = [];
  errorCarga = '';
  mensajeCancelacion = '';
  errorCancelacion = '';
  cancelandoNumero: string | null = null;

  ngOnInit(): void {
    this.cargarReservas();
  }

  private cargarReservas(): void {
    this.errorCarga = '';
    this.reservaService.obtenerReservasOperador().subscribe({
      next: (reservas) => {
        this.reservas = reservas;
      },
      error: (error: HttpErrorResponse) => {
        this.errorCarga = this.mensajeError(error);
      },
    });
  }

  cancelarReserva(numeroReserva: string): void {
    if (
      this.cancelandoNumero !== null ||
      !confirm(`¿Seguro que deseas cancelar la reserva ${numeroReserva}?`)
    ) {
      return;
    }

    this.cancelandoNumero = numeroReserva;
    this.mensajeCancelacion = '';
    this.errorCancelacion = '';
    this.reservaService.cancelarReservaOperador(numeroReserva).subscribe({
      next: (reservaActualizada) => {
        this.reservas = this.reservas.map((reserva) =>
          reserva.numeroReserva === reservaActualizada.numeroReserva
            ? reservaActualizada
            : reserva,
        );
        this.mensajeCancelacion = `La reserva ${numeroReserva} fue cancelada.`;
        this.cancelandoNumero = null;
      },
      error: (error: HttpErrorResponse) => {
        this.errorCancelacion = this.mensajeError(error);
        this.cancelandoNumero = null;
      },
    });
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
      : `No fue posible completar la operación (HTTP ${error.status}).`;
  }
}
