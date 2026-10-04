import { Component, input } from '@angular/core';
import { Reserva } from '../../../../models/reserva.model';
import { ReservaCard } from '../reserva-card/reserva-card';
// Lista las reservas finalizadas o canceladas.
@Component({
  selector: 'app-reservas-historial',
  imports: [ReservaCard],
  templateUrl: './reservas-historial.html',
  styleUrl: './reservas-historial.scss',
})
export class ReservasHistorial {
  reservas = input<Reserva[]>([]);
}
