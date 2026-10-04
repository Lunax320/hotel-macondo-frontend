import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Reserva } from '../../../../../models/reserva.model';

@Component({
  imports: [RouterLink],
  selector: 'app-reservas-tabla',
  templateUrl: './reservas-tabla.html',
})
export class ReservasTabla {
  reservas = input<Reserva[]>([]);
  cancelacionSolicitada = output<Reserva>();

  cancelar(reserva: Reserva): void {
    this.cancelacionSolicitada.emit(reserva);
  }

  formatearFecha(fecha: string): string {
    return new Date(`${fecha}T00:00:00`).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }
}
