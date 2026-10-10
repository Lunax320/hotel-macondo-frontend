import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

// Campos de nombre, descripción e imagen del tipo de habitación.
@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-tipo-habitacion-campos-basicos',
  styleUrl: './tipo-habitacion-campos-basicos.scss',
  templateUrl: './tipo-habitacion-campos-basicos.html',
})
export class TipoHabitacionCamposBasicos {
  // Formulario del padre (tipo-habitacion-form), que es quien valida y guarda.
  formulario = input<FormGroup>(new FormGroup({}));
}
