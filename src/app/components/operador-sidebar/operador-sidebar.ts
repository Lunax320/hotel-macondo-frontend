import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-operador-sidebar',
  styleUrl: './operador-sidebar.scss',
  templateUrl: './operador-sidebar.html',
})
export class OperadorSidebar {
  protected usuarioService = inject(UsuarioService);
}
