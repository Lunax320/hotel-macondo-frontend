import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OperadorSidebar } from '../../../components/operador-sidebar/operador-sidebar';
import { ConsumoCheckout } from '../../../models/consumo-checkout.model';
import { CheckoutEstadia } from './components/checkout-estadia/checkout-estadia';
import { CheckoutConsumos } from './components/checkout-consumos/checkout-consumos';
import { CheckoutVerificaciones } from './components/checkout-verificaciones/checkout-verificaciones';

@Component({
  imports: [OperadorSidebar, RouterLink, CheckoutEstadia, CheckoutConsumos, CheckoutVerificaciones],
  selector: 'app-operador-checkout',
  templateUrl: './checkout.html',
})
export class OperadorCheckout implements OnInit {
  private route = inject(ActivatedRoute);

  habitacionId = '301';
  consumos: ConsumoCheckout[] = [
    { concepto: 'Restaurante Gourmet', cantidad: 2, valorUnitario: 85_000 },
    { concepto: 'Minibar', cantidad: 3, valorUnitario: 45_000 },
  ];

  ngOnInit(): void {
    this.habitacionId = this.route.snapshot.queryParamMap.get('id') ?? '301';
  }

}
