import { Component, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-reserva-disponibilidad',
  styleUrl: './reserva-disponibilidad.scss',
  templateUrl: './reserva-disponibilidad.html',
})
export class ReservaDisponibilidad {
  consultada = input.required<boolean>();
  cantidadDisponibles = input.required<number>();
}
