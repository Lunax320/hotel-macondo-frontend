import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminSidebar } from '../../components/admin-sidebar/admin-sidebar';
import { Habitacion } from '../../models/habitacion.model';
import { Reserva } from '../../models/reserva.model';
import { HabitacionService } from '../../services/habitacion.service';
import { ReservaService } from '../../services/reserva.service';
import { HabitacionTable } from './components/habitacion-table/habitacion-table';

@Component({
  imports: [RouterLink, AdminSidebar, HabitacionTable],
  selector: 'app-admin-habitaciones',
  styleUrl: './admin-habitaciones.scss',
  templateUrl: './admin-habitaciones.html',
})
export class AdminHabitaciones implements OnInit {
  private habitacionService = inject(HabitacionService);
  private reservaService = inject(ReservaService);

  habitaciones: Habitacion[] = [];
  reservasAsociadas: Reserva[] = [];
  habitacionPendienteEliminar?: Habitacion;
  errorHabitacion = '';

  ngOnInit(): void {
    this.cargarHabitaciones();
  }

  cambiarEstado(habitacion: Habitacion): void {
    if (habitacion.id === undefined) {
      return;
    }

    this.limpiarAvisos();
    this.habitacionService.cambiarEstado(habitacion.id);
    this.cargarHabitaciones();
  }

  solicitarEliminacion(habitacion: Habitacion): void {
    this.limpiarAvisos();

    if (habitacion.id === undefined) {
      return;
    }

    this.reservasAsociadas = this.reservaService.obtenerPorHabitacionId(habitacion.id);

    if (this.reservasAsociadas.length > 0) {
      this.errorHabitacion = 'No se puede eliminar: la habitación tiene reservas asociadas.';
      return;
    }

    this.habitacionPendienteEliminar = habitacion;
  }

  confirmarEliminacion(): void {
    const habitacionId = this.habitacionPendienteEliminar?.id;

    if (habitacionId === undefined) {
      return;
    }

    const eliminada = this.habitacionService.eliminarHabitacion(habitacionId);

    if (!eliminada) {
      this.errorHabitacion = 'No se encontró la habitación que se intentó eliminar.';
    }

    this.habitacionPendienteEliminar = undefined;
    this.cargarHabitaciones();
  }

  cancelarEliminacion(): void {
    this.habitacionPendienteEliminar = undefined;
  }

  private cargarHabitaciones(): void {
    this.habitaciones = this.habitacionService.obtenerTodas();
  }

  private limpiarAvisos(): void {
    this.errorHabitacion = '';
    this.reservasAsociadas = [];
    this.habitacionPendienteEliminar = undefined;
  }
}
