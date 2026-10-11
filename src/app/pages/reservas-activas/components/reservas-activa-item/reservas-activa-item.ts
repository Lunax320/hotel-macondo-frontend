import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Reserva } from '../../../../models/reserva.model';

@Component({
  selector: 'app-reservas-activa-item',
  imports: [RouterLink],
  templateUrl: './reservas-activa-item.html',
})
export class ReservasActivaItem {
  reserva = input.required<Reserva>();
  clienteId = input.required<number>();
  cancelar = output<number>();

  onCancelar(): void {
    const id = this.reserva().id;
    if (id !== undefined && confirm('¿Seguro que deseas cancelar esta reserva?')) {
      this.cancelar.emit(id);
    }
  }
}