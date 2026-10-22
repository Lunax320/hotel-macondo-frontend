import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

// Saludo del cliente con nombre, fecha y enlace al perfil.
@Component({
  imports: [RouterLink],
  selector: 'app-cliente-saludo',
  templateUrl: './cliente-saludo.html',
  styleUrl: './cliente-saludo.scss',
})
export class ClienteSaludo {
  nombre = input<string>();
  apellido = input<string>();
  fechaActual = input<string>();
  clienteId = input<number>();

  // Enlace al perfil del cliente.
  rutaPerfil(): string[] {
    return ['/cliente', String(this.clienteId()), 'perfil'];
  }
}
