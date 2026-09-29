import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Habitacion } from '../../../../models/habitacion.model';

@Component({
  imports: [RouterLink],
  selector: 'app-habitacion-table',
  styleUrl: './habitacion-table.scss',
  templateUrl: './habitacion-table.html',
})
export class HabitacionTable {
  habitaciones = input<Habitacion[]>([]);
  cambioEstadoSolicitado = output<Habitacion>();
  eliminacionSolicitada = output<Habitacion>();

  cambiarEstado(habitacion: Habitacion): void {
    this.cambioEstadoSolicitado.emit(habitacion);
  }

  eliminar(habitacion: Habitacion): void {
    this.eliminacionSolicitada.emit(habitacion);
  }
}
