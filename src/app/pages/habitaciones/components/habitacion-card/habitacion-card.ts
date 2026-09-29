import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TipoHabitacion } from '../../../../models/tipo-habitacion.model';

@Component({
  imports: [RouterLink],
  selector: 'app-habitacion-card',
  styleUrl: './habitacion-card.scss',
  templateUrl: './habitacion-card.html',
})
export class HabitacionCard {
  tipoHabitacion = input.required<TipoHabitacion>();
  clienteId = input<number | null>(null);
}
