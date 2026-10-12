import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cuenta-habitacion-detalles',
  templateUrl: './cuenta-habitacion-detalles.html',
})
export class CuentaHabitacionDetalles {
  @Input({ required: true }) habitacionId = '';
}
