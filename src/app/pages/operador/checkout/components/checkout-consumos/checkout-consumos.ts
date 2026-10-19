import { CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ConsumoCheckout } from '../../../../../models/consumo-checkout.model';

@Component({
  imports: [CurrencyPipe],
  selector: 'app-checkout-consumos',
  templateUrl: './checkout-consumos.html',
})
export class CheckoutConsumos {
  @Input({ required: true }) consumos: ConsumoCheckout[] = [];

  get total(): number {
    return this.consumos.reduce(
      (suma, consumo) => suma + consumo.cantidad * consumo.valorUnitario,
      0,
    );
  }
}
