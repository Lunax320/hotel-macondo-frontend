import { Component, input } from '@angular/core';
import { TipoHabitacion } from '../../../../models/tipo-habitacion.model';
import { LandingHabitacionCard } from '../landing-habitacion-card/landing-habitacion-card';

@Component({
  imports: [LandingHabitacionCard],
  selector: 'app-landing-habitaciones',
  styleUrl: './landing-habitaciones.scss',
  templateUrl: './landing-habitaciones.html',
})
export class LandingHabitaciones {
  tiposHabitacion = input<TipoHabitacion[]>();
}
