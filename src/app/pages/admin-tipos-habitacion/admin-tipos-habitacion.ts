import { Component, inject, OnInit } from '@angular/core';
import { AdminSidebar } from '../../components/admin-sidebar/admin-sidebar';
import { TipoHabitacion } from '../../models/tipo-habitacion.model';
import { HabitacionService } from '../../services/habitacion.service';
import { TipoHabitacionService } from '../../services/tipo-habitacion.service';
import { TipoHabitacionForm } from './components/tipo-habitacion-form/tipo-habitacion-form';
import { TipoHabitacionTable } from './components/tipo-habitacion-table/tipo-habitacion-table';

@Component({
  imports: [AdminSidebar, TipoHabitacionTable, TipoHabitacionForm],
  selector: 'app-admin-tipos-habitacion',
  styleUrl: './admin-tipos-habitacion.scss',
  templateUrl: './admin-tipos-habitacion.html',
})
export class AdminTiposHabitacion implements OnInit {
  private tipoHabitacionService = inject(TipoHabitacionService);
  private habitacionService = inject(HabitacionService);

  tiposHabitacion: TipoHabitacion[] = [];
  tipoHabitacionSeleccionado?: TipoHabitacion;
  tipoHabitacionPendienteEliminar?: TipoHabitacion;
  formularioVisible = false;
  errorTipo = '';

  ngOnInit(): void {
    this.cargarTiposHabitacion();
  }

  abrirNuevoTipo(): void {
    this.limpiarAvisos();
    this.tipoHabitacionSeleccionado = undefined;
    this.formularioVisible = true;
  }

  abrirEdicion(tipoHabitacion: TipoHabitacion): void {
    this.limpiarAvisos();
    this.tipoHabitacionSeleccionado = tipoHabitacion;
    this.formularioVisible = true;
  }

  cerrarFormulario(): void {
    this.formularioVisible = false;
    this.tipoHabitacionSeleccionado = undefined;
  }

  guardarTipoHabitacion(tipoHabitacion: TipoHabitacion): void {
    this.errorTipo = '';
    let tipoGuardado: TipoHabitacion | undefined;

    if (tipoHabitacion.id === undefined) {
      tipoGuardado = this.tipoHabitacionService.agregarTipoHabitacion(tipoHabitacion);
    } else {
      tipoGuardado = this.tipoHabitacionService.actualizarTipoHabitacion(
        tipoHabitacion.id,
        tipoHabitacion,
      );

      if (!tipoGuardado) {
        this.errorTipo = 'No se encontró el tipo de habitación que se intentó actualizar.';
        return;
      }

      this.habitacionService.actualizarHabitacionesPorTipo(tipoGuardado);
    }

    this.cerrarFormulario();
    this.cargarTiposHabitacion();
  }

  solicitarEliminacion(tipoHabitacion: TipoHabitacion): void {
    this.limpiarAvisos();
    this.cerrarFormulario();

    if (tipoHabitacion.id === undefined) {
      return;
    }

    if (this.habitacionService.existeHabitacionConTipo(tipoHabitacion)) {
      this.errorTipo =
        'No se puede eliminar: existen habitaciones asociadas a este tipo de habitación.';
      return;
    }

    this.tipoHabitacionPendienteEliminar = tipoHabitacion;
  }

  confirmarEliminacion(): void {
    const tipoHabitacionId = this.tipoHabitacionPendienteEliminar?.id;

    if (tipoHabitacionId === undefined) {
      return;
    }

    const eliminado = this.tipoHabitacionService.eliminarTipoHabitacion(tipoHabitacionId);

    if (!eliminado) {
      this.errorTipo = 'No se encontró el tipo de habitación que se intentó eliminar.';
    }

    this.tipoHabitacionPendienteEliminar = undefined;
    this.cargarTiposHabitacion();
  }

  cancelarEliminacion(): void {
    this.tipoHabitacionPendienteEliminar = undefined;
  }

  private cargarTiposHabitacion(): void {
    this.tiposHabitacion = this.tipoHabitacionService.obtenerTodos();
  }

  private limpiarAvisos(): void {
    this.errorTipo = '';
    this.tipoHabitacionPendienteEliminar = undefined;
  }
}
