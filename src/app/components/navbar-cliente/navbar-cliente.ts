import { Component, inject, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';

// Navegación privada compartida para las páginas del cliente.
@Component({
  selector: 'app-navbar-cliente',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar-cliente.html',
  styleUrl: './navbar-cliente.scss',
})
export class NavbarCliente {
  protected usuarioService = inject(UsuarioService);
  clienteId = input.required<number>();
  mostrarVolver = input(false);
}
