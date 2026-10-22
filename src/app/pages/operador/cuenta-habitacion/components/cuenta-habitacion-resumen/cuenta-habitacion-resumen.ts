import { CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ConsumoHabitacion } from '../../../../../models/consumo-habitacion.model';

@Component({
  imports: [CurrencyPipe],
  selector: 'app-cuenta-habitacion-resumen',
  templateUrl: './cuenta-habitacion-resumen.html',
})
export class CuentaHabitacionResumen {
  @Input({ required: true }) consumos: ConsumoHabitacion[] = [];

  get subtotal(): number {
    return this.consumos.reduce((total, consumo) => total + consumo.precio * consumo.cantidad, 0);
  }

  get impuesto(): number {
    return Math.round(this.subtotal * 0.19);
  }

  get total(): number {
    return this.subtotal + this.impuesto;
  }
}
