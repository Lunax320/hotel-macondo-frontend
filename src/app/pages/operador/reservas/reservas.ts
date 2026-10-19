import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { concatMap, Subscription } from 'rxjs';
import { OperadorSidebar } from '../../../components/operador-sidebar/operador-sidebar';
import { ReservaOperador } from '../../../models/reserva-operador.model';
import { ReservaService } from '../../../services/reserva.service';
import { ReservasEstadisticas } from './components/reservas-estadisticas/reservas-estadisticas';
import { ReservasFiltros } from './components/reservas-filtros/reservas-filtros';
import { ReservasTabla } from './components/reservas-tabla/reservas-tabla';

@Component({
  imports: [OperadorSidebar, ReservasEstadisticas, ReservasFiltros, ReservasTabla],
  selector: 'app-operador-reservas',
  styleUrl: './reservas.scss',
  templateUrl: './reservas.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class OperadorReservas implements OnInit, OnDestroy {
  private reservaService = inject(ReservaService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cambiosFiltro?: Subscription;
  private carga?: Subscription;
  private cancelacion?: Subscription;

  reservas: ReservaOperador[] = [];
  textoBusqueda = '';
  filtro = 'todas';
  cargando = false;
  errorCarga = '';
  mensajeCancelacion = '';
  errorCancelacion = '';
  cancelandoNumero: string | null = null;

  ngOnInit(): void {
    // Mantiene el parámetro de navegación original /operador/reservas?filtro=activas.
    this.cambiosFiltro = this.route.queryParamMap.subscribe((parametros) => {
      this.filtro = parametros.get('filtro')?.toLowerCase() === 'activas' ? 'activas' : 'todas';
    });
    this.cargarReservas();
  }

  ngOnDestroy(): void {
    this.cambiosFiltro?.unsubscribe();
    this.carga?.unsubscribe();
    this.cancelacion?.unsubscribe();
  }

  get reservasFiltradas(): ReservaOperador[] {
    let resultado = this.reservas;
    // La agrupación conserva los estados abiertos de ReservaServiceImpl del backend.
    if (this.filtro === 'activas') {
      resultado = resultado.filter((reserva) =>
        ['ACTIVA', 'CONFIRMADA', 'PENDIENTE'].includes(reserva.estado.toUpperCase()),
      );
    }
    const busqueda = this.normalizarTexto(this.textoBusqueda);
    if (busqueda) {
      resultado = resultado.filter((reserva) => {
        const texto = [
          reserva.numeroReserva,
          reserva.cliente?.nombre,
          reserva.cliente?.apellido,
          reserva.habitacion?.numero,
          reserva.habitacion?.nombre,
          reserva.habitacion?.tipoHabitacion?.nombre,
        ].join(' ');
        return this.normalizarTexto(texto).includes(busqueda);
      });
    }
    return resultado;
  }

  get numerosCancelables(): string[] {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return this.reservas
      .filter(
        (reserva) =>
          new Date(`${reserva.fechaInicio}T00:00:00`).getTime() > hoy.getTime() &&
          ['ACTIVA', 'CONFIRMADA', 'PENDIENTE'].includes(reserva.estado.toUpperCase()),
      )
      .map((reserva) => reserva.numeroReserva);
  }

  actualizarBusqueda(texto: string): void {
    this.textoBusqueda = texto;
  }

  actualizarFiltro(filtro: string): void {
    this.router.navigate(['/operador/reservas'], {
      queryParams: { filtro: filtro === 'activas' ? 'activas' : 'todas' },
    });
  }

  cargarReservas(): void {
    if (this.cargando || this.cancelandoNumero !== null) return;
    this.errorCarga = '';
    this.cargando = true;
    this.carga = this.reservaService.obtenerReservasOperador().subscribe({
      next: (reservas) => {
        this.reservas = reservas;
        this.cargando = false;
      },
      error: (error: HttpErrorResponse) => {
        this.errorCarga = this.mensajeError(error);
        this.cargando = false;
      },
    });
  }

  cancelarReserva(numeroReserva: string): void {
    if (this.cargando || this.cancelandoNumero !== null) return;
    this.errorCancelacion = '';
    if (!this.numerosCancelables.includes(numeroReserva)) {
      this.errorCancelacion =
        'Solo se pueden cancelar reservas abiertas cuya entrada sea posterior a hoy.';
      return;
    }
    if (!confirm(`¿Seguro que deseas cancelar la reserva ${numeroReserva}?`)) return;

    this.cancelandoNumero = numeroReserva;
    this.mensajeCancelacion = '';
    let cancelacionConfirmada = false;
    this.cancelacion = this.reservaService
      .cancelarReservaOperador(numeroReserva)
      .pipe(
        concatMap((reservaActualizada) => {
          cancelacionConfirmada = true;
          // Refleja únicamente una respuesta ya confirmada por el servidor.
          this.reservas = this.reservas.map((reserva) =>
            reserva.numeroReserva === reservaActualizada.numeroReserva
              ? reservaActualizada
              : reserva,
          );
          this.mensajeCancelacion = `La reserva ${numeroReserva} fue cancelada.`;
          return this.reservaService.obtenerReservasOperador();
        }),
      )
      .subscribe({
        next: (reservas) => {
          this.reservas = reservas;
          this.cancelandoNumero = null;
        },
        error: (error: HttpErrorResponse) => {
          this.errorCancelacion = cancelacionConfirmada
            ? 'La cancelación se guardó, pero no fue posible recargar las reservas. Vuelve a consultar.'
            : this.mensajeError(error);
          this.cancelandoNumero = null;
        },
      });
  }

  private normalizarTexto(texto: string): string {
    return texto
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
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
      : `No fue posible completar la operación (HTTP ${error.status}).`;
  }
}
