import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Servicio } from '../../../../models/servicio.model';
import { EstadoBadge } from '../../../../components/estado-badge/estado-badge';

@Component({
  imports: [RouterLink, EstadoBadge],
  selector: 'app-servicio-table',
  styleUrl: './servicio-table.scss',
  templateUrl: './servicio-table.html',
})
export class ServicioTable {
  servicios = input<Servicio[]>([]);
  cambioEstadoSolicitado = output<Servicio>();

  cambiarEstado(servicio: Servicio): void {
    this.cambioEstadoSolicitado.emit(servicio);
  }
}
