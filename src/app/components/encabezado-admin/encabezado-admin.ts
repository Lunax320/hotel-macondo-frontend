import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

// Presenta el encabezado común de las pantallas administrativas.
@Component({
  selector: 'app-encabezado-admin',
  imports: [RouterLink],
  templateUrl: './encabezado-admin.html',
  styleUrl: './encabezado-admin.scss',
})
export class EncabezadoAdmin {
  titulo = input('');
  descripcion = input('');
  textoBoton = input<string>();
  rutaBoton = input<string>();
  // Clase de Bootstrap Icons opcional para el botón (ej. 'bi-plus-lg').
  iconoBoton = input('');
}
