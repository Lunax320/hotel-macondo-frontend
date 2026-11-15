import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

// Campos de capacidad y precio por noche del tipo de habitación.
@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-tipo-habitacion-campos-detalle',
  styleUrl: './tipo-habitacion-campos-detalle.scss',
  templateUrl: './tipo-habitacion-campos-detalle.html',
})
export class TipoHabitacionCamposDetalle {
  // Formulario del padre (tipo-habitacion-form), que es quien valida y guarda.
  formulario = input<FormGroup>(new FormGroup({}));
}
