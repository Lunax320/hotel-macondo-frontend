import { Component, input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MensajeErrorCampo } from '../../../../components/mensaje-error-campo/mensaje-error-campo';
import {
  CampoFormulario,
  ErrorCampo,
} from '../../../../components/campo-formulario/campo-formulario';

// Sección del registro con el correo y la contraseña de la cuenta.
@Component({
  imports: [CampoFormulario, MensajeErrorCampo],
  selector: 'app-registro-credenciales',
  styleUrl: './registro-credenciales.scss',
  templateUrl: './registro-credenciales.html',
})
export class RegistroCredenciales {
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

  // Se avisa apenas el usuario sale del campo de confirmar, sin esperar al botón.
  contrasenasDistintas(): boolean {
    const confirmar = this.formulario().get('confirmarContrasena');
    return (
      !!confirmar?.touched &&
      !!confirmar.value &&
      confirmar.value !== this.formulario().get('contrasena')?.value
    );
  }
}
