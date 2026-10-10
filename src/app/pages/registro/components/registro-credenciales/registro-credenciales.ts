import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MensajeErrorCampo } from '../../../../components/mensaje-error-campo/mensaje-error-campo';
import {
  CampoFormulario,
  ErrorCampo,
} from '../../../../components/campo-formulario/campo-formulario';

// Sección del registro con el correo y la contraseña de la cuenta.
@Component({
  imports: [CampoFormulario, MensajeErrorCampo, ReactiveFormsModule],
  selector: 'app-registro-credenciales',
  styleUrl: './registro-credenciales.scss',
  templateUrl: './registro-credenciales.html',
})
export class RegistroCredenciales {
  mostrarContrasena = false;
  // Mensajes que se muestran según el error de cada campo.
  erroresCorreo: ErrorCampo[] = [
    { clave: 'required', mensaje: 'El correo es obligatorio.' },
    { clave: 'email', mensaje: 'Ingresa un correo válido.' },
  ];
  erroresContrasena: ErrorCampo[] = [
    { clave: 'required', mensaje: 'La contraseña es obligatoria.' },
    { clave: 'minlength', mensaje: 'La contraseña debe tener al menos 6 caracteres.' },
  ];
  erroresConfirmarContrasena: ErrorCampo[] = [
    { clave: 'required', mensaje: 'Confirma tu contraseña.' },
  ];

  formulario = input<FormGroup>(new FormGroup({}));

  // Alterna la visibilidad de la contraseña.
  alternarContrasena(): void {
    this.mostrarContrasena = !this.mostrarContrasena;
  }

  // Informa si el validador del formulario detecta contraseñas distintas.
  contrasenasDistintas(): boolean {
    const confirmar = this.formulario().get('confirmarContrasena');
    return (
      !!confirmar?.touched &&
      !!confirmar.value &&
      !!this.formulario().hasError('contrasenasDistintas')
    );
  }
}
