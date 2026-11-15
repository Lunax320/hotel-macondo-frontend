import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

// Estado vacío cuando el cliente no tiene reserva activa.
@Component({
  imports: [RouterLink],
  selector: 'app-reserva-activa-vacia',
  templateUrl: './reserva-activa-vacia.html',
  styleUrl: './reserva-activa-vacia.scss',
})
export class ReservaActivaVacia {
  clienteId = input<number>();

  // Enlace para crear una nueva reserva.
  rutaNuevaReserva(): string[] {
    return ['/cliente', String(this.clienteId()), 'reservas', 'nueva'];
  }
}
