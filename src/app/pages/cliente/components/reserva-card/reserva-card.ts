import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Reserva } from '../../../../models/reserva.model';
// Muestra la información resumida de una reserva.
@Component({
  selector: 'app-reserva-card',
  imports: [DatePipe],
  templateUrl: './reserva-card.html',
  styleUrl: './reserva-card.scss',
})
export class ReservaCard {
  reserva = input.required<Reserva>();
  mostrarCancelar = input(false);
  historial = input(false);
  cancelacionSolicitada = output<Reserva>();
}
