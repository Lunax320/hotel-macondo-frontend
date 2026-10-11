import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class Login {
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);

  correo: string = '';
  contrasena: string = '';
  mensajeError: string = '';
  mostrarPassword: boolean = false;

  toggleMostrarPassword(): void {
    this.mostrarPassword = !this.mostrarPassword;
  }

  iniciarSesion(): void {
    this.mensajeError = '';

    if (!this.correo || !this.contrasena) {
      this.mensajeError = 'Por favor ingresa tu correo y contraseña.';
      return;
    }

    this.usuarioService.autenticar(this.correo, this.contrasena).subscribe({
      next: (usuario) => {
        if (!usuario) {
          this.mensajeError = 'Correo electrónico o contraseña incorrectos.';
          return;
        }

        // Redirección dinámica según el rol retornado por la base de datos
        if (usuario.rol === 'ADMINISTRADOR') {
          this.router.navigate(['/admin']);
        } else if (usuario.rol === 'OPERADOR') {
          this.router.navigate(['/operador']);
        } else {
          if (usuario.cliente?.id) {
            this.router.navigate(['/cliente', usuario.cliente.id]);
          } else {
            this.router.navigate(['/']);
          }
        }
      },
      error: () => {
        this.mensajeError = 'Correo electrónico o contraseña incorrectos.';
      },
    });
  }
}