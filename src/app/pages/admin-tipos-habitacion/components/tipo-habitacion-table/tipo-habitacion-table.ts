import { Component, input, output } from '@angular/core';
import { TipoHabitacion } from '../../../../models/tipo-habitacion.model';

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

  editar(tipoHabitacion: TipoHabitacion): void {
    this.edicionSolicitada.emit(tipoHabitacion);
  }

  eliminar(tipoHabitacion: TipoHabitacion): void {
    this.eliminacionSolicitada.emit(tipoHabitacion);
  }
}
