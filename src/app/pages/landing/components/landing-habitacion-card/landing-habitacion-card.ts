import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TipoHabitacion } from '../../../../models/tipo-habitacion.model';

@Component({
  imports: [RouterLink],
  selector: 'app-landing-habitacion-card',
  styleUrl: './landing-habitacion-card.scss',
  templateUrl: './landing-habitacion-card.html',
})
export class LandingHabitacionCard {
  tipoHabitacion = input<TipoHabitacion>();
}
