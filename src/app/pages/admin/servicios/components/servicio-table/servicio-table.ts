import { CurrencyPipe } from '@angular/common';
import { EstadoBadge } from '../../../../../components/estado-badge/estado-badge';
import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Servicio } from '../../../../../models/servicio.model';

@Component({
  imports: [CurrencyPipe, EstadoBadge, RouterLink],
  selector: 'app-servicio-table',
  styleUrl: './servicio-table.scss',
  templateUrl: './servicio-table.html',
})
export class ServicioTable {
  servicios = input<Servicio[]>([]);
  // true si la carga falló: no mostrar "lista vacía" porque sería engañoso
  cargaFallida = input(false);
  cambioEstadoSolicitado = output<Servicio>();

  // Solicita el cambio de estado del servicio.
  cambiarEstado(servicio: Servicio): void {
    this.cambioEstadoSolicitado.emit(servicio);
  }
}
