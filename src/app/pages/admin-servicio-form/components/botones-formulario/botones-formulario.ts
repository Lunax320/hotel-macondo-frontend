import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

// Botón de guardar (Crear/Guardar cambios) y enlace de cancelar del formulario.
@Component({
  imports: [RouterLink],
  selector: 'app-botones-formulario',
  styleUrl: './botones-formulario.scss',
  templateUrl: './botones-formulario.html',
})
export class BotonesFormulario {
  esEdicion = input(false);
  deshabilitado = input(false);
  rutaCancelar = input('');
}
