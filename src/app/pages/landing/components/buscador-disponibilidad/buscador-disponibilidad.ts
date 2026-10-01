import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TipoHabitacion } from '../../../../models/tipo-habitacion.model';

@Component({
  imports: [RouterLink],
  selector: 'app-buscador-disponibilidad',
  styleUrl: './buscador-disponibilidad.scss',
  templateUrl: './buscador-disponibilidad.html',
})
export class BuscadorDisponibilidad {
  tiposHabitacion = input<TipoHabitacion[]>();

  fechaEntradaMin: string = new Date().toISOString().split('T')[0];
  fechaSalidaMin: string = '';

  onEntradaChange(event: Event): void {
    const inputFecha = event.target as HTMLInputElement;
    this.fechaSalidaMin = inputFecha.value;
  }
}
