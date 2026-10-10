import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { switchMap } from 'rxjs';
import { AdminSidebar } from '../../components/admin-sidebar/admin-sidebar';
import { TipoHabitacion } from '../../models/tipo-habitacion.model';
import { TipoHabitacionService } from '../../services/tipo-habitacion.service';
import { TipoHabitacionForm } from './components/tipo-habitacion-form/tipo-habitacion-form';
import { ConfirmacionAccion } from '../../components/confirmacion-accion/confirmacion-accion';
import { TipoHabitacionTable } from './components/tipo-habitacion-table/tipo-habitacion-table';

// Pagina admin de tipos de habitacion: lista, crea, edita y elimina (via API).
@Component({
  imports: [ConfirmacionAccion, AdminSidebar, TipoHabitacionTable, TipoHabitacionForm],
  selector: 'app-admin-tipos-habitacion',
  styleUrl: './admin-tipos-habitacion.scss',
  templateUrl: './admin-tipos-habitacion.html',
  // Angular 22 usa OnPush por defecto; Eager actualiza la vista cuando responde el backend.
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class AdminTiposHabitacion implements OnInit {
  private tipoHabitacionService = inject(TipoHabitacionService);

  tiposHabitacion: TipoHabitacion[] = [];
  tipoHabitacionSeleccionado?: TipoHabitacion;
  tipoHabitacionPendienteEliminar?: TipoHabitacion;
  formularioVisible = false;
  errorTipo = '';

  // Inicializa el componente cargando los tipos de habitación.
  ngOnInit(): void {
    this.cargarTiposHabitacion();
  }

  // Abre el formulario para crear un tipo.
  abrirNuevoTipo(): void {
    this.limpiarAvisos();
    this.tipoHabitacionSeleccionado = undefined;
    this.formularioVisible = true;
  }

  // Abre el formulario para editar un tipo.
  abrirEdicion(tipoHabitacion: TipoHabitacion): void {
    this.limpiarAvisos();
    this.tipoHabitacionSeleccionado = tipoHabitacion;
    this.formularioVisible = true;
  }

  // Cierra el formulario de tipos.
  cerrarFormulario(): void {
    this.formularioVisible = false;
    this.tipoHabitacionSeleccionado = undefined;
  }

  // Guarda el tipo (crea o actualiza) y actualiza el listado.
  guardarTipoHabitacion(tipoHabitacion: TipoHabitacion): void {
    this.errorTipo = '';
    const guardado =
      tipoHabitacion.id === undefined
        ? this.tipoHabitacionService.agregarTipo(tipoHabitacion)
        : this.tipoHabitacionService.actualizarTipo(tipoHabitacion);

    guardado.pipe(switchMap(() => this.tipoHabitacionService.listarTipos())).subscribe({
      next: (tipos) => {
        this.tiposHabitacion = tipos;
        this.cerrarFormulario();
      },
      error: (error) =>
        (this.errorTipo = error.error?.mensaje ?? 'No fue posible guardar el tipo de habitación.'),
    });
  }

  // Solicita la confirmación para eliminar un tipo.
  solicitarEliminacion(tipoHabitacion: TipoHabitacion): void {
    this.limpiarAvisos();
    this.cerrarFormulario();

    if (tipoHabitacion.id === undefined) {
      return;
    }

    this.tipoHabitacionPendienteEliminar = tipoHabitacion;
  }

  // Elimina el tipo confirmado y recarga el listado.
  confirmarEliminacion(): void {
    const tipoHabitacionId = this.tipoHabitacionPendienteEliminar?.id;

    if (tipoHabitacionId === undefined) {
      return;
    }

    this.tipoHabitacionService
      .eliminarTipo(tipoHabitacionId)
      .pipe(switchMap(() => this.tipoHabitacionService.listarTipos()))
      .subscribe({
        next: (tipos) => {
          this.tiposHabitacion = tipos;
          this.tipoHabitacionPendienteEliminar = undefined;
        },
        error: (error) => {
          this.tipoHabitacionPendienteEliminar = undefined;
          this.errorTipo = error.error?.mensaje ?? 'No fue posible eliminar el tipo de habitación.';
        },
      });
  }

  // Cancela la eliminación pendiente.
  cancelarEliminacion(): void {
    this.tipoHabitacionPendienteEliminar = undefined;
  }

  // Carga los tipos de habitación desde el backend.
  private cargarTiposHabitacion(): void {
    this.tipoHabitacionService.listarTipos().subscribe({
      next: (tipos) => (this.tiposHabitacion = tipos),
      error: (error) =>
        (this.errorTipo = error.error?.mensaje ?? 'No fue posible cargar los tipos de habitación.'),
    });
  }

  // Limpia los avisos y confirmaciones activos.
  private limpiarAvisos(): void {
    this.errorTipo = '';
    this.tipoHabitacionPendienteEliminar = undefined;
  }
}
