import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DatosRegistro } from '../../../models/datos-registro.model';
import { ToastService } from '../../../services/toast.service';
import { ClienteService } from '../../../services/cliente.service';
import { UsuarioService } from '../../../services/usuario.service';
import { RegistroPresentacion } from './components/registro-presentacion/registro-presentacion';
import { RegistroFormulario } from './components/registro-formulario/registro-formulario';

// Página de registro que crea la cuenta y abre el portal del cliente.
@Component({
  selector: 'app-registro',
  imports: [RegistroPresentacion, RegistroFormulario],
  // Angular 22 usa OnPush por defecto; Eager actualiza la vista cuando responde el backend.
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './registro.html',
  styleUrl: './registro.scss',
})
export class Registro {
  private clienteService = inject(ClienteService);
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);
  private toast = inject(ToastService);

  mensajeError = '';

  // Envía el cliente validado al backend.
  registrar(datos: DatosRegistro): void {
    this.mensajeError = '';
    const cliente = { ...datos.cliente, correo: datos.cliente.correo.trim().toLowerCase() };
    this.clienteService.registrar(cliente, datos.contrasena).subscribe({
      next: (clienteGuardado) => {
        if (clienteGuardado.id) {
          this.toast.mostrar(`Cuenta creada. ¡Bienvenido, ${clienteGuardado.nombre}!`);
          this.usuarioService.autenticar(cliente.correo, datos.contrasena).subscribe({
            next: () => this.router.navigateByUrl(this.usuarioService.rutaInicio()),
            error: () => {
              this.mensajeError = 'La cuenta fue creada. Inicia sesión para acceder a tu portal.';
            },
          });
        }
      },
      error: (error) => {
        this.mensajeError =
          error.error?.mensaje ?? 'No fue posible crear la cuenta. Intenta de nuevo.';
      },
    });
  }
}
