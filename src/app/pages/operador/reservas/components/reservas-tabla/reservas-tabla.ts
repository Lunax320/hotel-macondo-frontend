import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReservaOperador } from '../../../../../models/reserva-operador.model';

@Component({
  imports: [RouterLink],
  selector: 'app-reservas-tabla',
  templateUrl: './reservas-tabla.html',
})
export class ReservasTabla {
  reservas = input<ReservaOperador[]>([]);
  numerosCancelables = input<string[]>([]);
  cancelandoNumero = input<string | null>(null);
  cancelacionSolicitada = output<string>();

  formatearFecha(fecha: string): string {
    return new Date(`${fecha}T00:00:00`).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  cancelar(reserva: ReservaOperador): void {
    if (
      this.cancelandoNumero() === null &&
      this.numerosCancelables().includes(reserva.numeroReserva)
    ) {
      this.cancelacionSolicitada.emit(reserva.numeroReserva);
    }
  }
}
