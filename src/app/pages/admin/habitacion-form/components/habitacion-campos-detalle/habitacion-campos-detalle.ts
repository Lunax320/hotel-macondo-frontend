import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

// Campos de detalle de la habitación: piso, capacidad, precio y estado.
@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-habitacion-campos-detalle',
  styleUrl: './habitacion-campos-detalle.scss',
  templateUrl: './habitacion-campos-detalle.html',
})
export class HabitacionCamposDetalle {
  formulario = input<FormGroup>(new FormGroup({}));
}
