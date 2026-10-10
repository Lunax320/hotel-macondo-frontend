import { Component } from '@angular/core';
import { ModuloCuenta } from '../modulo-cuenta/modulo-cuenta';
import { ModuloReservas } from '../modulo-reservas/modulo-reservas';
import { ModuloCheckout } from '../modulo-checkout/modulo-checkout';

@Component({
  imports: [ModuloReservas, ModuloCuenta, ModuloCheckout],
  selector: 'app-operador-modulos',
  templateUrl: './operador-modulos.html',
})
export class OperadorModulos {}
