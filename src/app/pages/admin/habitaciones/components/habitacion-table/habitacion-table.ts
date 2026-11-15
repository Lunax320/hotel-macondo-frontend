import { CurrencyPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { Habitacion } from '../../../../../models/habitacion.model';
import { HabitacionAcciones } from '../habitacion-acciones/habitacion-acciones';

// Tabla del inventario de habitaciones del panel admin.
@Component({
  imports: [CurrencyPipe, HabitacionAcciones],
  selector: 'app-habitacion-table',
  styleUrl: './habitacion-table.scss',
  templateUrl: './habitacion-table.html',
})
export class HabitacionTable {
  habitaciones = input<Habitacion[]>([]);
  // true si la carga falló: no mostrar "lista vacía" porque sería engañoso
  cargaFallida = input(false);
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
