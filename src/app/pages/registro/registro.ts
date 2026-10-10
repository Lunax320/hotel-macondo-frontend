import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ClienteService } from '../../services/cliente.service';
import { RegistroPresentacion } from './components/registro-presentacion/registro-presentacion';
import {
  DatosRegistro,
  RegistroFormulario,
} from './components/registro-formulario/registro-formulario';

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
  private router = inject(Router);

  mensajeError = '';

  // Envía el cliente validado al backend.
  registrar(datos: DatosRegistro): void {
    this.mensajeError = '';
    const cliente = { ...datos.cliente, correo: datos.cliente.correo.trim().toLowerCase() };
    this.clienteService.registrar(cliente, datos.contrasena).subscribe({
      next: (clienteGuardado) => {
        if (clienteGuardado.id) {
          this.router.navigate(['/cliente', clienteGuardado.id]);
        }
      },
      error: (error) => {
        this.mensajeError =
          error.error?.mensaje ?? 'No fue posible crear la cuenta. Intenta de nuevo.';
      },
    });
  }
}
