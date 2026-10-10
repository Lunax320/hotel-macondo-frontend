import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OperadorSidebar } from '../../../components/operador-sidebar/operador-sidebar';
import { Reserva } from '../../../models/reserva.model';
import { ReservaService } from '../../../services/reserva.service';
import { DetalleReservaCuenta } from './components/detalle-reserva-cuenta/detalle-reserva-cuenta';
import { DetalleReservaEncabezado } from './components/detalle-reserva-encabezado/detalle-reserva-encabezado';
import { DetalleReservaHabitacion } from './components/detalle-reserva-habitacion/detalle-reserva-habitacion';
import { DetalleReservaNoEncontrada } from './components/detalle-reserva-no-encontrada/detalle-reserva-no-encontrada';
import { DetalleReservaResumen } from './components/detalle-reserva-resumen/detalle-reserva-resumen';
import { DetalleReservaCliente } from './components/detalle-reserva-cliente/detalle-reserva-cliente';

@Component({
  imports: [
    OperadorSidebar,
    DetalleReservaCuenta,
    DetalleReservaEncabezado,
    DetalleReservaHabitacion,
    DetalleReservaNoEncontrada,
    DetalleReservaResumen,
    DetalleReservaCliente,
  ],
  selector: 'app-operador-detalle-reserva',
  templateUrl: './detalle-reserva.html',
})
export class OperadorDetalleReserva implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private reservaService = inject(ReservaService);

  reserva: Reserva | null = null;

  ngOnInit(): void {
    const numeroReserva = this.activatedRoute.snapshot.paramMap.get('numeroReserva');
    this.reserva =
      this.reservaService.obtenerTodas().find((reserva) => reserva.numeroReserva === numeroReserva) ??
      null;
  }
}
