import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';

interface CuentaReserva {
  id: number;
  estado: string;
  total: number;
  fechaApertura: string;
  consumos: {
    id: number;
    cantidad: number;
    precio: number;
    fechaRegistro: string;
    servicio: string | null;
  }[];
  pagos: {
    id: number;
    monto: number;
    metodoPago: string;
    fechaPago: string;
    estado: string;
  }[];
}

@Component({
  imports: [CurrencyPipe, DatePipe],
  selector: 'app-detalle-reserva-cuenta',
  templateUrl: './detalle-reserva-cuenta.html',
})
export class DetalleReservaCuenta {
  cuenta = input<CuentaReserva | null>();
}
