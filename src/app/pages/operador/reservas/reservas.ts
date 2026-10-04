import { Component, OnInit, inject } from '@angular/core';
import { OperadorSidebar } from '../../../components/operador-sidebar/operador-sidebar';
import { Reserva } from '../../../models/reserva.model';
import { ReservaService } from '../../../services/reserva.service';
import { ReservasEstadisticas } from './components/reservas-estadisticas/reservas-estadisticas';
import { ReservasTabla } from './components/reservas-tabla/reservas-tabla';

@Component({
  imports: [OperadorSidebar, ReservasEstadisticas, ReservasTabla],
  selector: 'app-operador-reservas',
  styleUrl: './reservas.scss',
  templateUrl: './reservas.html',
})
export class OperadorReservas implements OnInit {
  private reservaService = inject(ReservaService);

  reservas: Reserva[] = [];

  ngOnInit(): void {
    this.reservas = this.reservaService.obtenerTodas();
  }

  cancelarReserva(reserva: Reserva): void {
    if (reserva.estado === 'CONFIRMADA') {
      reserva.estado = 'CANCELADA';
      this.reservas = [...this.reservas];
    }
  }
}
