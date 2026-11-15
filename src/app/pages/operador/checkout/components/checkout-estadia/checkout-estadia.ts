import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReservaDetalleOperador } from '../../../../../models/reserva-detalle-operador.model';

@Component({
  imports: [DatePipe],
  selector: 'app-checkout-estadia',
  templateUrl: './checkout-estadia.html',
})
export class CheckoutEstadia {
  @Input() reserva: ReservaDetalleOperador | null = null;

  // Calcular total de noches entre fechas
  get totalNoches(): number {
    if (!this.reserva?.fechaInicio || !this.reserva?.fechaFin) {
      return 0;
    }
    const entrada = new Date(this.reserva.fechaInicio);
    const salida = new Date(this.reserva.fechaFin);
    const diffMs = salida.getTime() - entrada.getTime();
    const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return diffDias > 0 ? diffDias : 0;
  }
}
