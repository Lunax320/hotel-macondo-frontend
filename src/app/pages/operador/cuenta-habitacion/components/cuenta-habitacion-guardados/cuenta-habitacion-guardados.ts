import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CuentaReserva } from '../../../../../models/cuenta-reserva.model';

@Component({
  imports: [CurrencyPipe, DatePipe],
  selector: 'app-cuenta-habitacion-guardados',
  templateUrl: './cuenta-habitacion-guardados.html',
})
export class CuentaHabitacionGuardados {
  @Input() cuenta: CuentaReserva | null | undefined = null;
  @Output() eliminar = new EventEmitter<number>();
}
