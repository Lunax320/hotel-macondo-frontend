import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Reserva } from '../../../../../models/reserva.model';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-reservas-activa-item',
  imports: [RouterLink, DecimalPipe],
  templateUrl: './reservas-activa-item.html',
})
export class ReservasActivaItem {
  reserva = input.required<Reserva>();
  clienteId = input.required<number>();
  cancelar = output<number>();
  ocupado = input(false);
  cancelando = input(false);

  // Indica si la reserva admite las acciones que ofrece este elemento.
  get puedeGestionar(): boolean {
    const reserva = this.reserva();
    const hoy = new Date();
    hoy.setDate(hoy.getDate() - 1);
    hoy.setHours(0, 0, 0, 0);
    return (
      reserva.id !== undefined &&
      new Date(`${reserva.fechaInicio}T00:00:00`).getTime() > hoy.getTime() &&
      ['CONFIRMADA', 'PENDIENTE'].includes(reserva.estado.toUpperCase())
    );
  }

  // Emite la solicitud de cancelación para que la gestione el componente contenedor.
  onCancelar(): void {
    const id = this.reserva().id;
    if (
      this.puedeGestionar &&
      !this.ocupado() &&
      id !== undefined &&
      confirm('¿Seguro que deseas cancelar esta reserva?')
    ) {
      this.cancelar.emit(id);
    }
  }
}
