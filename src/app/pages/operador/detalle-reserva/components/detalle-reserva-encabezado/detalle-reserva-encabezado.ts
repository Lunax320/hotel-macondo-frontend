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

  // Si hay una página anterior, vuelve a ella para conservar el filtro y la búsqueda de la lista.
  volver(evento: Event): void {
    if (window.history.length > 1) {
      evento.preventDefault();
      window.history.back();
    }
  }
}
