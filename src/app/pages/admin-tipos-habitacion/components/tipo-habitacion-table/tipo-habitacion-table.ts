import { Component, input, output } from '@angular/core';
import { TipoHabitacion } from '../../../../models/tipo-habitacion.model';

// Tabla de tipos de habitacion; avisa al padre cuando se quiere editar o eliminar.
@Component({
  imports: [],
  selector: 'app-tipo-habitacion-table',
  styleUrl: './tipo-habitacion-table.scss',
  templateUrl: './tipo-habitacion-table.html',
})
export class TipoHabitacionTable {
  tiposHabitacion = input<TipoHabitacion[]>([]);
  edicionSolicitada = output<TipoHabitacion>();
  eliminacionSolicitada = output<TipoHabitacion>();

  // Pide al padre abrir el formulario con este tipo.
  editar(tipoHabitacion: TipoHabitacion): void {
    this.edicionSolicitada.emit(tipoHabitacion);
  }

  // Pide al padre confirmar la eliminacion de este tipo.
  eliminar(tipoHabitacion: TipoHabitacion): void {
    this.eliminacionSolicitada.emit(tipoHabitacion);
  }
}
