import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
  selector: 'app-checkout-verificaciones',
  templateUrl: './checkout-verificaciones.html',
})
export class CheckoutVerificaciones {
  cuentaSaldada = false;
  llavesDevueltas = false;
  habitacionInspeccionada = false;

  get verificacionesCompletas(): boolean {
    return this.cuentaSaldada && this.llavesDevueltas && this.habitacionInspeccionada;
  }
}
