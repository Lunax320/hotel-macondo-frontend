import { Component, input, output } from '@angular/core';
import { Servicio } from '../../../../models/servicio.model';

@Component({
  imports: [],
  selector: 'app-resumen-servicio',
  styleUrl: './resumen-servicio.scss',
  templateUrl: './resumen-servicio.html',
})
export class ResumenServicio {
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
