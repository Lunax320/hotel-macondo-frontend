import { Component, input } from '@angular/core';
import { TipoHabitacion } from '../../../../../models/tipo-habitacion.model';
import { LandingHabitacionCard } from '../landing-habitacion-card/landing-habitacion-card';

@Component({
  imports: [LandingHabitacionCard],
  selector: 'app-landing-habitaciones',
  styleUrl: './landing-habitaciones.scss',
  templateUrl: './landing-habitaciones.html',
})
export class LandingHabitaciones {
  tiposHabitacion = input<TipoHabitacion[]>();

  desplazar(carrusel: HTMLElement, direccion: -1 | 1): void {
    const primera = carrusel.firstElementChild;
    if (!primera) return;

    const limite = carrusel.scrollWidth - carrusel.clientWidth;
    const posicion = carrusel.scrollLeft;
    if (direccion < 0 && posicion <= 1) {
      carrusel.scrollTo({ left: limite });
      return;
    }
    if (direccion > 0 && posicion >= limite - 1) {
      carrusel.scrollTo({ left: 0 });
      return;
    }

    const ancho = primera.getBoundingClientRect().width;
    const espacio = parseFloat(getComputedStyle(carrusel).columnGap);
    carrusel.scrollBy({ left: direccion * (ancho + espacio) });
  }
}
