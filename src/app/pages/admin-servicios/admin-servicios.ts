import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { switchMap } from 'rxjs';
import { AdminSidebar } from '../../components/admin-sidebar/admin-sidebar';
import { EncabezadoAdmin } from '../../components/encabezado-admin/encabezado-admin';
import { Servicio } from '../../models/servicio.model';
import { ServicioService } from '../../services/servicio.service';
import { ServicioTable } from './components/servicio-table/servicio-table';

// Lista de servicios del administrador. Como en el backend, un servicio no se borra:
// se desactiva para que deje de verse en el sitio sin romper las cuentas que ya lo usaron.
@Component({
  imports: [AdminSidebar, EncabezadoAdmin, ServicioTable],
  selector: 'app-admin-servicios',
  styleUrl: './admin-servicios.scss',
  templateUrl: './admin-servicios.html',
  // Angular 22 usa OnPush por defecto; Eager actualiza la vista cuando responde el backend.
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class AdminServicios implements OnInit {
  private servicioService = inject(ServicioService);

  servicios: Servicio[] = [];
  errorServicio = '';

  ngOnInit(): void {
    this.cargarServicios();
  }

  // Cambia el estado y vuelve a traer la lista en un solo flujo (sin subscribe anidado).
  cambiarEstado(servicio: Servicio): void {
    if (servicio.id === undefined) {
      return;
    }

    this.servicioService
      .cambiarEstado(servicio.id)
      .pipe(switchMap(() => this.servicioService.buscarTodos()))
      .subscribe({
        next: (servicios) => {
          this.servicios = servicios;
        },
        error: (error) =>
          (this.errorServicio = error.error?.mensaje ?? 'No fue posible cambiar el estado.'),
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
