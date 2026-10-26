import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
  selector: 'app-checkout-verificaciones',
  templateUrl: './checkout-verificaciones.html',
})
export class CheckoutVerificaciones {
  @Input() cuentaPagada = false;
  @Input() reservaActiva = false;
  @Input() procesando = false;
  @Output() finalizar = new EventEmitter<void>();

  llavesDevueltas = false;
  habitacionInspeccionada = false;

  // Emitir finalización si se cumplen las verificaciones
  onFinalizar(): void {
    if (!this.cuentaPagada || !this.llavesDevueltas || !this.habitacionInspeccionada || !this.reservaActiva || this.procesando) {
      return;
    }
    this.finalizar.emit();
  }
}
