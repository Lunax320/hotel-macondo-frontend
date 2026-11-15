import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Reserva } from '../../../../../models/reserva.model';
import { CurrencyPipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-reservas-activa-item',
  imports: [RouterLink, CurrencyPipe],
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

  // Primer clic: pide confirmación visible en la tarjeta (no usa confirm() del navegador)
  pidiendoConfirmacion = false;

  // Pide confirmar antes de cancelar
  onCancelar(): void {
    if (this.puedeGestionar && !this.ocupado() && this.reserva().id !== undefined) {
      this.pidiendoConfirmacion = true;
    }
  }

  // Segundo clic: emite la cancelación para que la gestione el componente contenedor
  confirmarCancelacion(): void {
    const id = this.reserva().id;
    this.pidiendoConfirmacion = false;
    if (id !== undefined) {
      this.cancelar.emit(id);
    }
  }
}
