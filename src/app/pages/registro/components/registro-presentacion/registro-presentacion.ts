import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
// Presenta la propuesta visual de bienvenida al registro.
@Component({
  selector: 'app-registro-presentacion',
  imports: [RouterLink],
  templateUrl: './registro-presentacion.html',
  styleUrl: './registro-presentacion.scss',
})
export class RegistroPresentacion {}
