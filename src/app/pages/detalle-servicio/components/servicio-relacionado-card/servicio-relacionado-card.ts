import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Servicio } from '../../../../models/servicio.model';

@Component({
  imports: [RouterLink],
  selector: 'app-servicio-relacionado-card',
  styleUrl: './servicio-relacionado-card.scss',
  templateUrl: './servicio-relacionado-card.html',
})
export class ServicioRelacionadoCard {
  servicio = input.required<Servicio>();
}
