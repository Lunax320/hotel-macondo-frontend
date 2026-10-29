import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ModuloCheckoutEncabezado } from './components/modulo-checkout-encabezado/modulo-checkout-encabezado';
import { FormularioCheckout } from './components/formulario-checkout/formulario-checkout';

@Component({
  imports: [ModuloCheckoutEncabezado, FormularioCheckout],
  selector: 'app-modulo-checkout',
  templateUrl: './modulo-checkout.html',
})
export class ModuloCheckout {
  private router = inject(Router);

  // Navega al checkout de la habitación indicada.
  iniciarCheckout(id: string): void {
    if (/^\d+$/.test(id)) {
      this.router.navigate(['/operador/checkout'], { queryParams: { id } });
    }
  }
}
