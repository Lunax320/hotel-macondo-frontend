import { Component, input } from '@angular/core';
import { ReservaOperador } from '../../../../../models/reserva-operador.model';

@Component({
  selector: 'app-reservas-estadisticas',
  templateUrl: './reservas-estadisticas.html',
})
export class ReservasEstadisticas {
  reservas = input<ReservaOperador[]>([]);

  totalReservas(): number {
    return this.reservas().length;
  }

  reservasActivas(): number {
    return this.contarPorEstado('ACTIVA');
  }

  reservasConfirmadas(): number {
    return this.contarPorEstado('CONFIRMADA');
  }

  reservasCanceladas(): number {
    return this.contarPorEstado('CANCELADA');
  }

  private contarPorEstado(estado: string): number {
    return this.reservas().filter((reserva) => reserva.estado.toUpperCase() === estado).length;
  }
}
