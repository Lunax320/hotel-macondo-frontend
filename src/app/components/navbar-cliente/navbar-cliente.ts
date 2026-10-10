import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

// Navegación privada compartida para las páginas del cliente.
@Component({
  selector: 'app-navbar-cliente',
  imports: [RouterLink],
  templateUrl: './navbar-cliente.html',
  styleUrl: './navbar-cliente.scss',
})
export class NavbarCliente {
  clienteId = input.required<number>();
}
