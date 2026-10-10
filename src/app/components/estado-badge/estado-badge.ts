import { Component, input } from '@angular/core';
// Pastilla verde/gris que indica si un registro (servicio, operador) está activo.
@Component({
  selector: 'app-estado-badge',
  templateUrl: './estado-badge.html',
  styleUrl: './estado-badge.scss',
})
export class EstadoBadge {
  activo = input(false);
}
