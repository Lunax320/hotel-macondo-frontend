import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConsumoHabitacion } from '../../../../../models/consumo-habitacion.model';

@Component({
  imports: [CurrencyPipe],
  selector: 'app-cuenta-habitacion-tabla',
  templateUrl: './cuenta-habitacion-tabla.html',
})
export class CuentaHabitacionTabla {
  @Input({ required: true }) consumos: ConsumoHabitacion[] = [];
  @Output() eliminar = new EventEmitter<ConsumoHabitacion>();
}
