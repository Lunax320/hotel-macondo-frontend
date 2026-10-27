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

  // Suma de los pagos ya registrados (anticipos)
  get abonado(): number {
    return (this.cuenta?.pagos ?? []).reduce((suma, pago) => suma + pago.monto, 0);
  }

  // Lo que falta por pagar: total de la cuenta menos lo abonado (igual que en el backend)
  get saldo(): number {
    return (this.cuenta?.total ?? 0) - this.abonado;
  }

  // Emitir pago con el método seleccionado
  onPagar(): void {
    if (!this.cuenta || this.cuenta.estado !== 'ABIERTA' || this.procesando) {
      return;
    }
    this.pagar.emit(this.metodoPago);
  }
}
