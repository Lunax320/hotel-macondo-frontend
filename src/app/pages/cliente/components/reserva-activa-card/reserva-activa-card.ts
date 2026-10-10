import { Component, input } from '@angular/core';
import { DatePipe, LowerCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Reserva } from '../../../../models/reserva.model';
import { Habitacion } from '../../../../models/habitacion.model';

// Tarjeta de reserva activa con detalles de habitación, fechas y enlace a detalles.
@Component({
  imports: [DatePipe, LowerCasePipe, RouterLink],
  selector: 'app-reserva-activa-card',
  templateUrl: './reserva-activa-card.html',
  styleUrl: './reserva-activa-card.scss',
})
export class ReservaActivaCard {
  reserva = input<Reserva>();
  habitacionActiva = input<Habitacion | null>();
  noches = input<number>();
  clienteId = input<number>();

  // Enlace a la lista de reservas del cliente.
  rutaReservas(): string[] {
    return ['/cliente', String(this.clienteId()), 'reservas'];
  }
}
