import { Component, input } from '@angular/core';
// Saluda al cliente en el portal personal.
@Component({
  selector: 'app-cliente-encabezado',
  templateUrl: './cliente-encabezado.html',
  styleUrl: './cliente-encabezado.scss',
})
export class ClienteEncabezado {
  nombre = input<string>();
}
