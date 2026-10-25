import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CuentaReserva } from '../../../../../models/cuenta-reserva.model';

@Component({
  imports: [CurrencyPipe, DatePipe, FormsModule],
  selector: 'app-checkout-pago',
  templateUrl: './checkout-pago.html',
})
export class CheckoutPago {
  @Input() cuenta: CuentaReserva | null = null;
  @Input() procesando = false;
  @Output() pagar = new EventEmitter<string>();

  metodoPago = 'EFECTIVO';

  // Emitir pago con el método seleccionado
  onPagar(): void {
    if (!this.cuenta || this.cuenta.estado !== 'ABIERTA' || this.procesando) {
      return;
    }
    this.pagar.emit(this.metodoPago);
  }
}
