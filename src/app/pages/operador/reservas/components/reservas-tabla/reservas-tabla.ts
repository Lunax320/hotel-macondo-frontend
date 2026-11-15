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
  cambiandoNumero = input<string | null>(null);
  activacionSolicitada = output<string>();
  cancelacionSolicitada = output<string>();

  // Formatea la fecha de la reserva para su presentación en la tabla.
  formatearFecha(fecha: string): string {
    return new Date(`${fecha}T00:00:00`).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  // Emite la solicitud para activar la reserva seleccionada.
  activar(reserva: ReservaOperador): void {
    if (this.cambiandoNumero() === null && reserva.estado.toUpperCase() === 'CONFIRMADA') {
      this.activacionSolicitada.emit(reserva.numeroReserva);
    }
  }

  // Emite la solicitud para cancelar la reserva seleccionada.
  cancelar(reserva: ReservaOperador): void {
    if (this.cambiandoNumero() === null && reserva.estado.toUpperCase() === 'CONFIRMADA') {
      this.cancelacionSolicitada.emit(reserva.numeroReserva);
    }
  }
}
