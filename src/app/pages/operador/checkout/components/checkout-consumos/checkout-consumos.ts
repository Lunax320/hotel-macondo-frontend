import { CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReservaDetalleOperador } from '../../../../../models/reserva-detalle-operador.model';

@Component({
  imports: [CurrencyPipe],
  selector: 'app-checkout-consumos',
  templateUrl: './checkout-consumos.html',
})
export class CheckoutConsumos {
  @Input() reserva: ReservaDetalleOperador | null = null;

  // Devuelve la cuenta de la reserva actual para mostrar sus consumos.
  get cuenta() {
    return this.reserva?.cuenta ?? null;
  }

  // El total sale de la cuenta del backend (hospedaje + servicios)
  get total(): number {
    return this.cuenta?.total ?? 0;
  }
}
