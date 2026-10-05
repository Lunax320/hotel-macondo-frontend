import { Component, input, output } from '@angular/core';
import { Reserva } from '../../../../models/reserva.model';
import { ReservaCard } from '../reserva-card/reserva-card';
// Lista las reservas que aún pueden cancelarse.
@Component({
  selector: 'app-reservas-activas',
  imports: [ReservaCard],
  templateUrl: './reservas-activas.html',
  styleUrl: './reservas-activas.scss',
})
export class ReservasActivas {
  reservas = input<Reserva[]>([]);
  cancelacionSolicitada = output<Reserva>();
}
