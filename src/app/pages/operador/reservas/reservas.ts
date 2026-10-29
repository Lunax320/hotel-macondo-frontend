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
  private cambioEstado?: Subscription;

  reservas: ReservaOperador[] = [];
  textoBusqueda = '';
  filtro = 'todas';
  cargando = false;
  errorCarga = '';
  mensajeAccion = '';
  errorAccion = '';
  cambiandoNumero: string | null = null;

  // Sincroniza el filtro con la URL y carga las reservas del operador.
  ngOnInit(): void {
    // Mantiene el parámetro de navegación original /operador/reservas?filtro=activas.
    this.cambiosFiltro = this.route.queryParamMap.subscribe((parametros) => {
      this.filtro = parametros.get('filtro')?.toLowerCase() === 'activas' ? 'activas' : 'todas';
    });
    this.cargarReservas();
  }

  // Cancela las suscripciones de ruta, carga y cambio de estado al salir.
  ngOnDestroy(): void {
    this.cambiosFiltro?.unsubscribe();
    this.carga?.unsubscribe();
    this.cambioEstado?.unsubscribe();
  }

  // Aplica el filtro de estado y la búsqueda normalizada sobre los datos cargados.
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

  // Actualiza el texto que se aplica a la búsqueda de reservas.
  actualizarBusqueda(texto: string): void {
    this.textoBusqueda = texto;
  }

  // Navega con el filtro seleccionado para mantenerlo reflejado en la URL.
  actualizarFiltro(filtro: string): void {
    this.router.navigate(['/operador/reservas'], {
      queryParams: { filtro: filtro === 'activas' ? 'activas' : 'todas' },
    });
  }

  // Carga las reservas del operador mientras no haya otra acción en curso.
  cargarReservas(): void {
    if (this.cargando || this.cambiandoNumero !== null) return;
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

  // Valida el estado y la confirmación antes de solicitar la cancelación.
  cancelarReserva(numeroReserva: string): void {
    if (this.cargando || this.cambiandoNumero !== null) return;
    this.errorAccion = '';
    const reserva = this.reservas.find((item) => item.numeroReserva === numeroReserva);
    if (!reserva || reserva.estado.toUpperCase() !== 'CONFIRMADA') {
      this.errorAccion = 'Solo se pueden cancelar reservas confirmadas.';
      return;
    }
    if (!confirm(`¿Seguro que deseas cancelar la reserva ${numeroReserva}?`)) return;

    this.cambiarEstadoReserva(numeroReserva, 'cancelar');
  }

  // Valida el estado antes de solicitar la activación de la reserva.
  activarReserva(numeroReserva: string): void {
    if (this.cargando || this.cambiandoNumero !== null) return;
    this.errorAccion = '';
    const reserva = this.reservas.find((item) => item.numeroReserva === numeroReserva);
    if (!reserva || reserva.estado.toUpperCase() !== 'CONFIRMADA') {
      this.errorAccion = 'Solo se pueden activar reservas confirmadas.';
      return;
    }

    this.cambiarEstadoReserva(numeroReserva, 'activar');
  }

  // Aplica el cambio de estado y recarga la lista, distinguiendo un fallo de actualización posterior al éxito.
  private cambiarEstadoReserva(numeroReserva: string, accion: 'activar' | 'cancelar'): void {
    this.cambiandoNumero = numeroReserva;
    this.mensajeAccion = '';
    this.errorAccion = '';
    let cambioConfirmado = false;
    const solicitud =
      accion === 'activar'
        ? this.reservaService.activarReservaOperador(numeroReserva)
        : this.reservaService.cancelarReservaOperador(numeroReserva);

    this.cambioEstado = solicitud
      .pipe(
        concatMap((reservaActualizada) => {
          cambioConfirmado = true;
          // Refleja únicamente una respuesta ya confirmada por el servidor.
          this.reservas = this.reservas.map((reserva) =>
            reserva.numeroReserva === reservaActualizada.numeroReserva
              ? reservaActualizada
              : reserva,
          );
          this.mensajeAccion =
            accion === 'activar'
              ? `La reserva ${numeroReserva} fue activada.`
              : `La reserva ${numeroReserva} fue cancelada.`;
          return this.reservaService.obtenerReservasOperador();
        }),
      )
      .subscribe({
        next: (reservas) => {
          this.reservas = reservas;
          this.cambiandoNumero = null;
        },
        error: (error: HttpErrorResponse) => {
          this.errorAccion = cambioConfirmado
            ? 'El cambio de estado se guardó, pero no fue posible recargar las reservas. Vuelve a consultar.'
            : this.mensajeError(error);
          this.cambiandoNumero = null;
        },
      });
  }

  // Quita espacios y diacríticos y convierte el texto a minúsculas para facilitar la búsqueda.
  private normalizarTexto(texto: string): string {
    return texto
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  // Usa el mensaje del backend o un texto alternativo según el fallo de conexión o respuesta.
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
