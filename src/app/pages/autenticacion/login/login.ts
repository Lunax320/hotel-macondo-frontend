import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AlertaMensaje } from '../../../components/alerta-mensaje/alerta-mensaje';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule, AlertaMensaje],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class Login {
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  correo: string = '';
  contrasena: string = '';
  mensajeError: string = '';
  mostrarPassword: boolean = false;
  enviando = false;

  // Alterna la visibilidad de la contraseña en el formulario.
  toggleMostrarPassword(): void {
    this.mostrarPassword = !this.mostrarPassword;
  }

  // Valida las credenciales y dirige al usuario según su rol, conservando el tipo solicitado cuando corresponde.
  iniciarSesion(): void {
    this.mensajeError = '';

    if (!this.correo || !this.contrasena) {
      this.mensajeError = 'Por favor ingresa tu correo y contraseña.';
      return;
    }

    // Evita enviar dos veces mientras llega la respuesta.
    if (this.enviando) {
      return;
    }
    this.enviando = true;

    this.usuarioService.autenticar(this.correo, this.contrasena).subscribe({
      next: (usuario) => {
        this.enviando = false;
        if (!usuario) {
          this.mensajeError = 'Correo electrónico o contraseña incorrectos.';
          return;
        }

        const inicio = this.usuarioService.rutaInicio();
        if (inicio.startsWith('/cliente/')) {
          const clienteId = usuario.cliente?.id;
          if (clienteId === undefined || !Number.isInteger(clienteId) || clienteId < 1) {
            this.mensajeError = 'La cuenta no tiene un cliente asociado.';
            return;
          }
          const tipoId = Number(this.route.snapshot.queryParams['tipoId']);
          if (Number.isInteger(tipoId) && tipoId > 0) {
            this.router.navigate(['/cliente', clienteId, 'reservas', 'nueva'], {
              queryParams: { tipoId },
            });
          } else {
            this.router.navigate(['/cliente', clienteId]);
          }
        } else {
          this.router.navigateByUrl(inicio);
        }
      },
      error: () => {
        this.enviando = false;
        this.mensajeError = 'Correo electrónico o contraseña incorrectos.';
      },
    });
  }
}
