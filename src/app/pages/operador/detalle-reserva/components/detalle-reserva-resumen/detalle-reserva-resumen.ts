import { Component, input } from '@angular/core';
import { Reserva } from '../../../../../models/reserva.model';

@Component({
  selector: 'app-detalle-reserva-resumen',
  templateUrl: './detalle-reserva-resumen.html',
})
export class DetalleReservaResumen {
  reserva = input.required<Reserva>();

  formatearFecha(fecha: string): string {
    return new Date(`${fecha}T00:00:00`).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  calcularNoches(fechaInicio: string, fechaFin: string): number {
    const [inicioAnio, inicioMes, inicioDia] = fechaInicio.split('-').map(Number);
    const [finAnio, finMes, finDia] = fechaFin.split('-').map(Number);
    const inicio = Date.UTC(inicioAnio, inicioMes - 1, inicioDia);
    const fin = Date.UTC(finAnio, finMes - 1, finDia);

    return Math.max(0, (fin - inicio) / (24 * 60 * 60 * 1000));
  }

  formatearMoneda(valor?: number): string {
    if (valor === undefined) {
      return 'No disponible';
    }

    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(valor);
  }
}
