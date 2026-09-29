import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Servicio } from '../../../../models/servicio.model';

@Component({
  imports: [RouterLink],
  selector: 'app-servicio-card',
  styleUrl: './servicio-card.scss',
  templateUrl: './servicio-card.html',
})
export class ServicioCard {
  servicio = input.required<Servicio>();
  agregado = input(false);
  alternarAgregado = output<number>();

  alternar(): void {
    const id = this.servicio().id;

    if (id !== undefined) {
      this.alternarAgregado.emit(id);
    }
  }
}
