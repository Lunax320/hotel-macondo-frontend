import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OperadorSidebar } from '../../../components/operador-sidebar/operador-sidebar';
import { ConsumoHabitacion } from '../../../models/consumo-habitacion.model';
import { CuentaHabitacionDetalles } from './components/cuenta-habitacion-detalles/cuenta-habitacion-detalles';
import { CuentaHabitacionServicios } from './components/cuenta-habitacion-servicios/cuenta-habitacion-servicios';
import { CuentaHabitacionTabla } from './components/cuenta-habitacion-tabla/cuenta-habitacion-tabla';
import { CuentaHabitacionResumen } from './components/cuenta-habitacion-resumen/cuenta-habitacion-resumen';
import { ReservaService } from '../../../services/reserva.service';
import { ConsumoServicioSolicitud } from '../../../models/consumo-servicio-solicitud.model';
import { ReservaDetalleOperador } from '../../../models/reserva-detalle-operador.model';
import { switchMap } from 'rxjs';
import { CuentaHabitacionGuardados } from './components/cuenta-habitacion-guardados/cuenta-habitacion-guardados';

@Component({
  imports: [
    OperadorSidebar,
    RouterLink,
    CuentaHabitacionDetalles,
    CuentaHabitacionServicios,
    CuentaHabitacionTabla,
    CuentaHabitacionResumen,
    CuentaHabitacionGuardados,
  ],
  selector: 'app-operador-cuenta-habitacion',
  templateUrl: './cuenta-habitacion.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class OperadorCuentaHabitacion implements OnInit {
  private route = inject(ActivatedRoute);
  private reservaServicio = inject(ReservaService);

  habitacionId = 0;
  reservaDetalle: ReservaDetalleOperador | null = null;
  numeroReserva: string | null = null;
  mensajeGuardado = '';
  guardando = false;

  consumos: ConsumoHabitacion[] = [];

  // Carga el detalle de la reserva y su habitación al iniciar la página
  ngOnInit(): void {
    const reservaIdParametro = this.route.snapshot.paramMap.get('reservaId');
    const reservaId = Number(reservaIdParametro);
    if (!reservaIdParametro || !Number.isSafeInteger(reservaId) || reservaId < 1) {
      this.mensajeGuardado = 'El identificador de la reserva no es válido.';
      return;
    }

    this.reservaServicio.obtenerDetalleOperadorPorId(reservaId).subscribe({
      next: (reserva) => {
        const numeroHabitacion = Number(reserva.habitacion?.numero);
        if (!Number.isInteger(numeroHabitacion) || numeroHabitacion < 1) {
          this.mensajeGuardado = 'No se encontró una habitación válida para esta reserva.';
          return;
        }

        this.habitacionId = numeroHabitacion;
        this.reservaDetalle = reserva;
        this.numeroReserva = reserva.numeroReserva;
        this.mensajeGuardado = '';
      },
      error: (error) => {
        this.mensajeGuardado =
          error.error?.mensaje ?? 'No fue posible cargar la información de la reserva.';
      },
    });
  }

  // Agrega o acumula un servicio en la lista local antes de guardarlo
  agregarServicio(consumoNuevo: ConsumoHabitacion): void {
    this.mensajeGuardado = '';
    const existente = this.consumos.find(
      (consumo) => consumo.servicioId === consumoNuevo.servicioId,
    );

    if (existente) {
      const consumosActualizados: ConsumoHabitacion[] = [];

      for (const consumo of this.consumos) {
        if (consumo.servicioId === consumoNuevo.servicioId) {
          consumosActualizados.push({
            ...consumo,
            cantidad: consumo.cantidad + consumoNuevo.cantidad,
          });
        } else {
          consumosActualizados.push(consumo);
        }
      }

      this.consumos = consumosActualizados;
      return;
    }

    this.consumos = [...this.consumos, consumoNuevo];
  }

  // Retira de la selección local el consumo asociado al servicio indicado.
  eliminarConsumo(consumo: ConsumoHabitacion) {
    this.mensajeGuardado = '';
    // Se crea un nuevo arreglo de consumos sin el consumo que se desea eliminar
    const newConsumos: ConsumoHabitacion[] = [];
    // Se recorre el arreglo de consumos y se agregan al nuevo arreglo todos los consumos que no coincidan con el consumo a eliminar
    for (let i = 0; i < this.consumos.length; i++) {
      if (this.consumos[i].servicioId !== consumo.servicioId) {
        newConsumos.push(this.consumos[i]);
      }
    }
    // Se actualiza el arreglo de consumos con el nuevo arreglo que no contiene el consumo eliminado
    this.consumos = newConsumos;
  }

  // Guarda los servicios en la cuenta y recarga el detalle de la reserva
  guardarServicios(): void {
    if (this.guardando) {
      return;
    }
    if (this.numeroReserva === null) {
      this.mensajeGuardado = 'No se encontró una reserva vigente para guardar los servicios.';
      return;
    }
    if (this.consumos.length === 0) {
      this.mensajeGuardado = 'Agrega al menos un servicio antes de guardar.';
      return;
    }

    const datos: ConsumoServicioSolicitud[] = this.consumos.map((consumo) => ({
      servicioId: consumo.servicioId,
      cantidad: consumo.cantidad,
    }));

    const reservaId = this.reservaDetalle?.id;
    if (reservaId === undefined) {
      this.mensajeGuardado = 'No se encontró una reserva vigente para guardar los servicios.';
      return;
    }

    this.guardando = true;
    this.mensajeGuardado = '';

    this.reservaServicio
      .agregarServiciosAReserva(this.numeroReserva, datos)
      .pipe(switchMap(() => this.reservaServicio.obtenerDetalleOperadorPorId(reservaId)))
      .subscribe({
        next: (reserva) => {
          this.reservaDetalle = reserva;
          this.consumos = [];
          this.mensajeGuardado = 'Los servicios se agregaron a la cuenta.';
          this.guardando = false;
        },
        error: (error) => {
          console.error('No fue posible guardar los servicios:', error);
          this.mensajeGuardado =
            error.error?.mensaje ?? 'No fue posible guardar los servicios en la cuenta.';
          this.guardando = false;
        },
      });
  }

  // Elimina un servicio guardado de la cuenta y recarga el detalle de la reserva
  eliminarGuardado(detalleId: number): void {
    if (this.numeroReserva === null || this.reservaDetalle === null) {
      this.mensajeGuardado = 'No se encontró una reserva vigente para eliminar el servicio.';
      return;
    }

    const numeroReserva = this.numeroReserva;
    const reservaId = this.reservaDetalle.id;
    if (reservaId === undefined) {
      this.mensajeGuardado = 'No se encontró una reserva vigente para eliminar el servicio.';
      return;
    }

    this.mensajeGuardado = '';
    this.reservaServicio
      .eliminarServicioDeReserva(numeroReserva, detalleId)
      .pipe(switchMap(() => this.reservaServicio.obtenerDetalleOperadorPorId(reservaId)))
      .subscribe({
        next: (reserva) => {
          this.reservaDetalle = reserva;
          this.mensajeGuardado = 'Servicio eliminado de la cuenta.';
        },
        error: (error) => {
          this.mensajeGuardado =
            error.error?.mensaje ?? 'No fue posible eliminar el servicio de la cuenta.';
        },
      });
  }
}
