import { Component, input } from '@angular/core';
import { CuentaReserva } from '../../../../../models/cuenta-reserva.model';

@Component({
  imports: [],
  selector: 'app-detalle-reserva-cuenta',
  templateUrl: './detalle-reserva-cuenta.html',
})
export class DetalleReservaCuenta {
  cuenta = input<CuentaReserva | null>();

  // Formatea la fecha para presentarla en el detalle de la cuenta.
  formatearFecha(fecha: string, formato: 'medium' | 'short' = 'medium'): string {
    return new Intl.DateTimeFormat('es-CO', {
      dateStyle: formato,
      timeStyle: 'short',
    }).format(new Date(fecha));
  }

  // Presenta el importe con el formato monetario de la interfaz.
  formatearMoneda(valor: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      currencyDisplay: 'narrowSymbol',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(valor);
  }
}
