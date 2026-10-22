import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReservaDetalleOperador } from '../../../../../models/reserva-detalle-operador.model';

@Component({
  imports: [RouterLink],
  selector: 'app-detalle-reserva-encabezado',
  templateUrl: './detalle-reserva-encabezado.html',
})
export class DetalleReservaEncabezado {
  reserva = input.required<ReservaDetalleOperador>();
}
