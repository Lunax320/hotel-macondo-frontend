import { Component, input } from '@angular/core';
// Indica si un servicio está activo o inactivo.
@Component({
  selector: 'app-estado-badge',
  templateUrl: './estado-badge.html',
  styleUrl: './estado-badge.scss',
})
export class EstadoBadge {
  activo = input(false);
}
