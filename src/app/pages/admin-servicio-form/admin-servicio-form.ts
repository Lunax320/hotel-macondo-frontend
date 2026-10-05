import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminSidebar } from '../../components/admin-sidebar/admin-sidebar';
import { AlertaMensaje } from '../../components/alerta-mensaje/alerta-mensaje';
import { EncabezadoAdmin } from '../../components/encabezado-admin/encabezado-admin';
import { Servicio } from '../../models/servicio.model';
import { ServicioService } from '../../services/servicio.service';
import { ServicioFormulario } from './components/servicio-formulario/servicio-formulario';

// Página para crear (/admin/servicios/nuevo) o editar (/admin/servicios/editar/:id) un servicio.
@Component({
  imports: [AdminSidebar, EncabezadoAdmin, AlertaMensaje, ServicioFormulario],
  selector: 'app-admin-servicio-form',
  styleUrl: './admin-servicio-form.scss',
  templateUrl: './admin-servicio-form.html',
})
export class AdminServicioForm implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private servicioService = inject(ServicioService);

  servicio?: Servicio;
  esEdicion = false;
  servicioEncontrado = true;
  errorServicio = '';

  // Si la URL trae id es edición: se busca el servicio antes de mostrar el formulario.
  ngOnInit(): void {
    const idParametro = this.route.snapshot.params['id'];

    if (idParametro === undefined) {
      return;
    }

    const id = Number(idParametro);
    this.esEdicion = true;

    if (!Number.isInteger(id) || id < 1) {
      this.servicioEncontrado = false;
      this.errorServicio = 'El identificador del servicio no es válido.';
      return;
    }

    this.servicioService.buscarPorId(id).subscribe((servicio) => {
      if (!servicio) {
        this.servicioEncontrado = false;
        this.errorServicio = `No se encontró el servicio con id ${id}.`;
        return;
      }

      this.servicio = servicio;
    });
  }

  guardar(servicio: Servicio): void {
    const peticion$ =
      this.esEdicion && servicio.id !== undefined
        ? this.servicioService.actualizarServicio(servicio.id, servicio)
        : this.servicioService.agregarServicio(servicio);

    peticion$.subscribe(() => this.router.navigate(['/admin/servicios']));
  }
}
