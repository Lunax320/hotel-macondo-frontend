import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { AdminSidebar } from '../../../components/admin-sidebar/admin-sidebar';
import { Habitacion } from '../../../models/habitacion.model';
import { HabitacionService } from '../../../services/habitacion.service';
import { ToastService } from '../../../services/toast.service';
import { ConfirmacionAccion } from '../../../components/confirmacion-accion/confirmacion-accion';
import { HabitacionTable } from './components/habitacion-table/habitacion-table';

// Pagina admin del inventario de habitaciones: lista, cambia estado y elimina (via API).
@Component({
  imports: [ConfirmacionAccion, RouterLink, AdminSidebar, HabitacionTable],
  selector: 'app-admin-habitaciones',
  styleUrl: './admin-habitaciones.scss',
  templateUrl: './admin-habitaciones.html',
  // Angular 22 usa OnPush por defecto; Eager actualiza la vista cuando responde el backend.
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class AdminHabitaciones implements OnInit {
  private habitacionService = inject(HabitacionService);
  private toast = inject(ToastService);

  habitaciones: Habitacion[] = [];
  habitacionPendienteEliminar?: Habitacion;
  habitacionPendienteEstado?: Habitacion;
  errorHabitacion = '';

  // Inicializa el componente cargando la lista de habitaciones.
  ngOnInit(): void {
    this.cargarHabitaciones();
  }

  // Pide confirmación antes de alternar la disponibilidad.
  cambiarEstado(habitacion: Habitacion): void {
    this.limpiarAvisos();

    if (habitacion.id === undefined) {
      return;
    }

    this.habitacionPendienteEstado = habitacion;
  }

  // Alterna la disponibilidad de la habitación confirmada.
  confirmarEstado(): void {
    const habitacion = this.habitacionPendienteEstado;

    if (habitacion?.id === undefined) {
      return;
    }

    const habilitar = habitacion.estado !== 'DISPONIBLE';
    this.habitacionPendienteEstado = undefined;
    this.habitacionService
      .cambiarEstadoHabitacion(habitacion.id)
      .pipe(switchMap(() => this.habitacionService.listarHabitaciones()))
      .subscribe({
        next: (habitaciones) => {
          this.habitaciones = habitaciones;
          this.toast.mostrar(
            `Habitación ${habitacion.nombre} ${habilitar ? 'habilitada' : 'deshabilitada'}.`,
          );
        },
        error: (error) =>
          this.toast.mostrar(
            error.error?.mensaje ?? 'No fue posible cambiar el estado.',
            'error',
          ),
      });
  }

  // Cancela el cambio de estado pendiente.
  cancelarEstado(): void {
    this.habitacionPendienteEstado = undefined;
  }

  // Solicita la confirmación para eliminar una habitación.
  solicitarEliminacion(habitacion: Habitacion): void {
    this.limpiarAvisos();

    if (habitacion.id === undefined) {
      return;
    }

    this.habitacionPendienteEliminar = habitacion;
  }

  // Elimina la habitación confirmada y recarga la lista.
  confirmarEliminacion(): void {
    const habitacionId = this.habitacionPendienteEliminar?.id;
    const nombre = this.habitacionPendienteEliminar?.nombre;

    if (habitacionId === undefined) {
      return;
    }

    this.habitacionService
      .eliminarHabitacion(habitacionId)
      .pipe(switchMap(() => this.habitacionService.listarHabitaciones()))
      .subscribe({
        next: (habitaciones) => {
          this.habitaciones = habitaciones;
          this.habitacionPendienteEliminar = undefined;
          this.toast.mostrar(`Habitación ${nombre} eliminada.`);
        },
        error: (error) => {
          this.habitacionPendienteEliminar = undefined;
          this.toast.mostrar(
            error.error?.mensaje ?? 'No fue posible eliminar la habitación.',
            'error',
          );
        },
      });
  }

  // Cancela la eliminación pendiente.
  cancelarEliminacion(): void {
    this.habitacionPendienteEliminar = undefined;
  }

  // Obtiene las habitaciones desde el backend.
  private cargarHabitaciones(): void {
    this.habitacionService.listarHabitaciones().subscribe({
      next: (habitaciones) => (this.habitaciones = habitaciones),
      error: (error) =>
        (this.errorHabitacion = error.error?.mensaje ?? 'No fue posible cargar las habitaciones.'),
    });
  }

  // Limpia mensajes y confirmaciones anteriores.
  private limpiarAvisos(): void {
    this.errorHabitacion = '';
    this.habitacionPendienteEliminar = undefined;
    this.habitacionPendienteEstado = undefined;
  }
}
