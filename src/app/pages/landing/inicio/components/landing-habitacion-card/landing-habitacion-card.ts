import { CurrencyPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TipoHabitacion } from '../../../../../models/tipo-habitacion.model';

@Component({
  imports: [CurrencyPipe, RouterLink],
  selector: 'app-landing-habitacion-card',
  styleUrl: './landing-habitacion-card.scss',
  templateUrl: './landing-habitacion-card.html',
})
export class LandingHabitacionCard {
  tipoHabitacion = input<TipoHabitacion>();

  imagen = computed(() => {
    const tipo = this.tipoHabitacion();
    if (tipo?.nombre === 'Superior' && tipo.imagen === '/images/HabitacionExecutive.avif') {
      return '/images/HabitacionSuperior.jpg';
    }
    return tipo?.imagen || '/images/HabitacionNormal.avif';
  });
}
