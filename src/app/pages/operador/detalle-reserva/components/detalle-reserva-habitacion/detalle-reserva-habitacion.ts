import { Component, input } from '@angular/core';
import { Habitacion } from '../../../../../models/habitacion.model';

@Component({
  selector: 'app-detalle-reserva-habitacion',
  templateUrl: './detalle-reserva-habitacion.html',
})
export class DetalleReservaHabitacion {
  habitacion = input<Habitacion | undefined>();
}
