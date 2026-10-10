import { Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TipoHabitacion } from '../../../../models/tipo-habitacion.model';

// Campos básicos de la habitación: tipo, nombre, etiqueta y número.
@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-habitacion-campos-basicos',
  styleUrl: './habitacion-campos-basicos.scss',
  templateUrl: './habitacion-campos-basicos.html',
})
export class HabitacionCamposBasicos {
  formulario = input<FormGroup>(new FormGroup({}));
  tiposHabitacion = input<TipoHabitacion[]>([]);
  // Avisa al padre que cambió el tipo, para que copie su capacidad y precio.
  tipoCambiado = output<void>();
}
