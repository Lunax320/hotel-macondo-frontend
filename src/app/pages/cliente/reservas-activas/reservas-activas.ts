import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { concatMap } from 'rxjs';
import { NavbarCliente } from '../../../components/navbar-cliente/navbar-cliente';
import { Reserva } from '../../../models/reserva.model';
import { ToastService } from '../../../services/toast.service';
import { ReservaService } from '../../../services/reserva.service';
import { ReservasFiltroBarra } from './components/reservas-filtro-barra/reservas-filtro-barra';
import { ReservasActivaItem } from './components/reservas-activa-item/reservas-activa-item';
import { ReservasMetricasResumen } from './components/reservas-metricas-resumen/reservas-metricas-resumen';

@Component({
  selector: 'app-reservas-activas',
  imports: [NavbarCliente, ReservasFiltroBarra, ReservasActivaItem, ReservasMetricasResumen],
  templateUrl: './reservas-activas.html',
  styleUrl: './reservas-activas.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class ReservasActivas implements OnInit {
  private route = inject(ActivatedRoute);
  private reservaService = inject(ReservaService);
  private toast = inject(ToastService);

  clienteId = 0;
  reservas: Reserva[] = [];
  filtroActual = 'TODOS';
  cargando = false;
  errorCarga = '';
  errorCancelacion = '';
  cancelandoId?: number;

  // Lee el cliente y después carga sus reservas activas.
  ngOnInit(): void {
    this.clienteId = Number(this.route.snapshot.params['id']);
    this.cargarReservas();
  }

  // Valida el identificador y actualiza la lista de reservas activas del cliente.
  cargarReservas(): void {
    if (this.cancelandoId !== undefined) return;
    this.errorCarga = '';
    if (!Number.isInteger(this.clienteId) || this.clienteId < 1) {
      this.errorCarga = 'El identificador del cliente no es válido.';
      return;
    }
    this.cargando = true;
    this.reservaService.buscarActivasPorCliente(this.clienteId).subscribe({
      next: (datos) => {
        this.reservas = datos;
        this.cargando = false;
      },
      error: (error: HttpErrorResponse) => {
        this.errorCarga = this.obtenerMensajeError(error);
        this.cargando = false;
      },
    });
  }

  // Devuelve las reservas que coinciden con el estado seleccionado.
  get reservasFiltradas(): Reserva[] {
    if (this.filtroActual === 'TODOS') {
      return this.reservas;
    }
    return this.reservas.filter((r) => r.estado?.toUpperCase() === this.filtroActual);
  }

  // Establece el estado con el que se filtra la lista visible.
  actualizarFiltro(estado: string): void {
    this.filtroActual = estado;
  }

  // Cancela una reserva y recarga la lista para reflejar el estado confirmado por el servidor.
  cancelarReserva(reservaId: number): void {
    if (this.cancelandoId !== undefined || this.cargando) return;
    this.cancelandoId = reservaId;
    this.errorCancelacion = '';
    let cancelacionConfirmada = false;
    this.reservaService
      .cancelar(this.clienteId, reservaId)
      .pipe(
        concatMap((reserva) => {
          cancelacionConfirmada = true;
          this.reservas = this.reservas.filter((item) => item.id !== reserva.id);
          this.toast.mostrar(`La reserva ${reserva.numeroReserva} fue cancelada. Puedes consultarla en el historial.`);
          return this.reservaService.buscarActivasPorCliente(this.clienteId);
        }),
      )
      .subscribe({
        next: (reservas) => {
          this.reservas = reservas;
          this.cancelandoId = undefined;
        },
        error: (error: HttpErrorResponse) => {
          this.errorCancelacion = cancelacionConfirmada
            ? 'La cancelación se guardó, pero no fue posible actualizar el listado. Vuelve a consultar.'
            : this.obtenerMensajeError(error);
          this.cancelandoId = undefined;
        },
      });
  }

  // Prioriza el mensaje recibido del backend y ofrece alternativas para fallos de conexión u operación.
  private obtenerMensajeError(error: HttpErrorResponse): string {
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
      ? 'No fue posible conectar con el backend.'
      : 'No fue posible completar la consulta u operación.';
  }

  // Cuenta las reservas cuyo estado coincide con el valor indicado.
  contarPorEstado(estado: string): number {
    return this.reservas.filter((r) => r.estado?.toUpperCase() === estado).length;
  }
}
