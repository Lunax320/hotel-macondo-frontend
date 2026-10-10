import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Reserva } from '../../../../../models/reserva.model';

@Component({
  imports: [RouterLink],
  selector: 'app-detalle-reserva-encabezado',
  templateUrl: './detalle-reserva-encabezado.html',
})
export class DetalleReservaEncabezado {
  reserva = input.required<Reserva>();
}
