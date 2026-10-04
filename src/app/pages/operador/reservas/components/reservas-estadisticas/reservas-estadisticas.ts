import { Component, computed, input } from '@angular/core';
import { Reserva } from '../../../../../models/reserva.model';

@Component({
  selector: 'app-reservas-estadisticas',
  templateUrl: './reservas-estadisticas.html',
})
export class ReservasEstadisticas {
  reservas = input<Reserva[]>([]);

  totalReservas = computed(() => this.reservas().length);
  reservasActivas = computed(
    () => this.reservas().filter((reserva) => reserva.estado === 'ACTIVA').length,
  );
  reservasConfirmadas = computed(
    () => this.reservas().filter((reserva) => reserva.estado === 'CONFIRMADA').length,
  );
  reservasCanceladas = computed(
    () => this.reservas().filter((reserva) => reserva.estado === 'CANCELADA').length,
  );
}
