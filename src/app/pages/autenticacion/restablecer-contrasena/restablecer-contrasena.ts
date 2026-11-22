import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-restablecer-contrasena',
  imports: [FormsModule, RouterLink],
  templateUrl: './restablecer-contrasena.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class RestablecerContrasena {
  private usuarioService = inject(UsuarioService);
  private route = inject(ActivatedRoute);

  token = this.route.snapshot.queryParamMap.get('token') ?? '';
  nuevaContrasena = '';
  confirmarContrasena = '';
  mensaje = '';
  error = '';
  enviando = false;

  restablecer(): void {
    this.error = '';
    this.mensaje = '';
    if (!this.token) {
      this.error = 'El enlace no es válido. Solicita uno nuevo para recuperar tu contraseña.';
      return;
    }
    if (this.nuevaContrasena !== this.confirmarContrasena) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }

    this.enviando = true;
    this.usuarioService
      .restablecerContrasena(this.token, this.nuevaContrasena, this.confirmarContrasena)
      .subscribe({
        next: () => {
          this.enviando = false;
          this.mensaje = 'Tu contraseña se actualizó. Ya puedes iniciar sesión.';
          this.nuevaContrasena = '';
          this.confirmarContrasena = '';
        },
        error: (respuesta) => {
          this.enviando = false;
          this.error =
            respuesta.error?.mensaje ??
            'El enlace no es válido o expiró. Solicita uno nuevo para recuperar tu contraseña.';
        },
      });
  }
}
