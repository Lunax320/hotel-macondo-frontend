import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

// Botones de guardar (Crear/Guardar cambios) y cancelar del formulario de habitación.
@Component({
  imports: [RouterLink],
  selector: 'app-botones-formulario-habitacion',
  styleUrl: './botones-formulario-habitacion.scss',
  templateUrl: './botones-formulario-habitacion.html',
})
export class BotonesFormularioHabitacion {
  esEdicion = input(false);
  deshabilitado = input(false);
  rutaCancelar = input('');
}
