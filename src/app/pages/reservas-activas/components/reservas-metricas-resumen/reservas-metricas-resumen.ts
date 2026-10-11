import { Component, input } from '@angular/core';

@Component({
  selector: 'app-reservas-metricas-resumen',
  templateUrl: './reservas-metricas-resumen.html',
})
export class ReservasMetricasResumen {
  totalReservas = input.required<number>();
  totalActivas = input.required<number>();
  totalConfirmadas = input.required<number>();
  totalPendientes = input.required<number>();
}