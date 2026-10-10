import { Component, input, output } from '@angular/core';
import { Habitacion } from '../../../../models/habitacion.model';
import { HabitacionAcciones } from '../habitacion-acciones/habitacion-acciones';

// Tabla del inventario de habitaciones del panel admin.
@Component({
  imports: [HabitacionAcciones],
  selector: 'app-habitacion-table',
  styleUrl: './habitacion-table.scss',
  templateUrl: './habitacion-table.html',
})
export class HabitacionTable {
  habitaciones = input<Habitacion[]>([]);
  cambioEstadoSolicitado = output<Habitacion>();
  eliminacionSolicitada = output<Habitacion>();

  // Reenvia a la pagina la solicitud de cambiar el estado.
  cambiarEstado(habitacion: Habitacion): void {
    this.cambioEstadoSolicitado.emit(habitacion);
  }

  // Reenvia a la pagina la solicitud de eliminar.
  eliminar(habitacion: Habitacion): void {
    this.eliminacionSolicitada.emit(habitacion);
  }
}
