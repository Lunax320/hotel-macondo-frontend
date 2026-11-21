import { CurrencyPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TipoHabitacion } from '../../../../../models/tipo-habitacion.model';

@Component({
  imports: [CurrencyPipe, RouterLink],
  selector: 'app-resumen-reserva-habitacion',
  styleUrl: './resumen-reserva-habitacion.scss',
  templateUrl: './resumen-reserva-habitacion.html',
})
export class ResumenReservaHabitacion {
  tipoHabitacion = input.required<TipoHabitacion>();
  hayDisponibilidad = input(false);
  clienteId = input<number | null>(null);
}
