import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-recuperar-contrasena',
  imports: [FormsModule, RouterLink],
  templateUrl: './recuperar-contrasena.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class RecuperarContrasena {
  private usuarioService = inject(UsuarioService);

  correo = '';
  mensaje = '';
  error = '';
  enviando = false;

  solicitar(): void {
    this.error = '';
    this.mensaje = '';
    this.enviando = true;

    this.usuarioService.solicitarRecuperacion(this.correo.trim().toLowerCase()).subscribe({
      next: (respuesta) => {
        this.enviando = false;
        this.mensaje = respuesta.mensaje;
      },
      error: () => {
        this.enviando = false;
        this.error = 'No fue posible procesar la solicitud. Intenta nuevamente más tarde.';
      },
    });
  }
}
