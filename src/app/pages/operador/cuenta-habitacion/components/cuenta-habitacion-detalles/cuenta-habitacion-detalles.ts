import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { ReservaDetalleOperador } from '../../../../../models/reserva-detalle-operador.model';

@Component({
  imports: [DatePipe],
  selector: 'app-cuenta-habitacion-detalles',
  templateUrl: './cuenta-habitacion-detalles.html',
})
export class CuentaHabitacionDetalles {
  reserva = input<ReservaDetalleOperador | null>(null);
}
