import { Component, input } from '@angular/core';
import { HabitacionDetalleOperador } from '../../../../../models/habitacion-detalle-operador.model';

@Component({
  selector: 'app-detalle-reserva-habitacion',
  templateUrl: './detalle-reserva-habitacion.html',
})
export class DetalleReservaHabitacion {
  habitacion = input<HabitacionDetalleOperador | null>();
}
