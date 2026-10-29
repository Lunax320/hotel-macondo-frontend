import { Component, input } from '@angular/core';
import { ReservaOperador } from '../../../../../models/reserva-operador.model';

@Component({
  selector: 'app-reservas-estadisticas',
  templateUrl: './reservas-estadisticas.html',
})
export class ReservasEstadisticas {
  reservas = input<ReservaOperador[]>([]);

  // Devuelve la cantidad total de reservas recibidas.
  totalReservas(): number {
    return this.reservas().length;
  }

  // Cuenta las reservas con estado activo.
  reservasActivas(): number {
    return this.contarPorEstado('ACTIVA');
  }

  // Cuenta las reservas confirmadas.
  reservasConfirmadas(): number {
    return this.contarPorEstado('CONFIRMADA');
  }

  // Cuenta las reservas canceladas.
  reservasCanceladas(): number {
    return this.contarPorEstado('CANCELADA');
  }

  // Cuenta las reservas cuyo estado coincide con el valor indicado.
  private contarPorEstado(estado: string): number {
    return this.reservas().filter((reserva) => reserva.estado.toUpperCase() === estado).length;
  }
}
