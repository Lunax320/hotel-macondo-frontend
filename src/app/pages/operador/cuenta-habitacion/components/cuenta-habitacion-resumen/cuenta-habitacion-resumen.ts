import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConsumoHabitacion } from '../../../../../models/consumo-habitacion.model';

@Component({
  imports: [CurrencyPipe],
  selector: 'app-cuenta-habitacion-resumen',
  templateUrl: './cuenta-habitacion-resumen.html',
})
export class CuentaHabitacionResumen {
  @Input({ required: true }) consumos: ConsumoHabitacion[] = [];

  // Calcula el subtotal de los consumos de la cuenta.
  get subtotal(): number {
    return this.consumos.reduce((total, consumo) => total + consumo.precio * consumo.cantidad, 0);
  }

  // Calcula el total de la cuenta a partir de sus importes.
  get total(): number {
    return this.subtotal;
  }

  @Output() agregarServicios = new EventEmitter<void>();
}
