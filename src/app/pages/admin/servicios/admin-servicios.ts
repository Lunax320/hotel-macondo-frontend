import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { switchMap } from 'rxjs';
import { AdminSidebar } from '../../../components/admin-sidebar/admin-sidebar';
import { EncabezadoAdmin } from '../../../components/encabezado-admin/encabezado-admin';
import { ConfirmacionAccion } from '../../../components/confirmacion-accion/confirmacion-accion';
import { Servicio } from '../../../models/servicio.model';
import { ServicioService } from '../../../services/servicio.service';
import { ToastService } from '../../../services/toast.service';
import { ServicioTable } from './components/servicio-table/servicio-table';

// Lista de servicios del administrador. Como en el backend, un servicio no se borra:
// se desactiva para que deje de verse en el sitio sin romper las cuentas que ya lo usaron.
@Component({
  imports: [ConfirmacionAccion, AdminSidebar, EncabezadoAdmin, ServicioTable],
  selector: 'app-admin-servicios',
  styleUrl: './admin-servicios.scss',
  templateUrl: './admin-servicios.html',
  // Angular 22 usa OnPush por defecto; Eager actualiza la vista cuando responde el backend.
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class AdminServicios implements OnInit {
  private servicioService = inject(ServicioService);
  private toast = inject(ToastService);

  servicios: Servicio[] = [];
  servicioPendiente?: Servicio;
  errorServicio = '';

  // Carga el catálogo de servicios al iniciar la pantalla de administración.
  ngOnInit(): void {
    this.cargarServicios();
  }

  // Pide confirmación antes de cambiar el estado.
  cambiarEstado(servicio: Servicio): void {
    if (servicio.id !== undefined) {
      this.servicioPendiente = servicio;
    }
  }

  // Cancela el cambio de estado pendiente.
  cancelarEstado(): void {
    this.servicioPendiente = undefined;
  }

  // Cambia el estado y vuelve a traer la lista en un solo flujo (sin subscribe anidado).
  confirmarEstado(): void {
    const servicio = this.servicioPendiente;

    if (servicio?.id === undefined) {
      return;
    }

    this.servicioPendiente = undefined;
    this.servicioService
      .cambiarEstado(servicio.id)
      .pipe(switchMap(() => this.servicioService.buscarTodos()))
      .subscribe({
        next: (servicios) => {
          this.servicios = servicios;
          this.toast.mostrar(
            `Servicio ${servicio.nombre} ${servicio.activo ? 'desactivado' : 'activado'}.`,
          );
        },
        error: (error) =>
          this.toast.mostrar(error.error?.mensaje ?? 'No fue posible cambiar el estado.', 'error'),
      });
  }

  // Carga los servicios desde el backend.
  private cargarServicios(): void {
    this.servicioService.buscarTodos().subscribe({
      next: (servicios) => (this.servicios = servicios),
      error: (error) =>
        (this.errorServicio = error.error?.mensaje ?? 'No fue posible cargar los servicios.'),
    });
  }
}
