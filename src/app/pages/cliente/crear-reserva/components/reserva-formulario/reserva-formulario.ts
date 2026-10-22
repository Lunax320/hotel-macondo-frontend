import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TipoHabitacion } from '../../../../../models/tipo-habitacion.model';

@Component({
  imports: [ReactiveFormsModule, DecimalPipe],
  selector: 'app-reserva-formulario',
  styleUrl: './reserva-formulario.scss',
  templateUrl: './reserva-formulario.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class ReservaFormulario {
  formulario = input.required<FormGroup>();
  tiposHabitacion = input.required<TipoHabitacion[]>();
  fechaMinima = input.required<string>();
  criteriosCambiados = output<void>();
}
