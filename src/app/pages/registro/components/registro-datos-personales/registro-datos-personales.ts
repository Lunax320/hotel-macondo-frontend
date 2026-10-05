import { Component, input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  CampoFormulario,
  ErrorCampo,
} from '../../../../components/campo-formulario/campo-formulario';

// Sección del registro con los datos personales del cliente.
@Component({
  imports: [CampoFormulario],
  selector: 'app-registro-datos-personales',
  styleUrl: './registro-datos-personales.scss',
  templateUrl: './registro-datos-personales.html',
})
export class RegistroDatosPersonales {
  // Mensajes que se muestran según el error de cada campo.
  erroresNombre: ErrorCampo[] = [
    { clave: 'required', mensaje: 'El nombre es obligatorio.' },
    { clave: 'minlength', mensaje: 'El nombre debe tener al menos 2 caracteres.' },
  ];
  erroresApellido: ErrorCampo[] = [
    { clave: 'required', mensaje: 'El apellido es obligatorio.' },
    { clave: 'minlength', mensaje: 'El apellido debe tener al menos 2 caracteres.' },
  ];
  erroresCedula: ErrorCampo[] = [
    { clave: 'required', mensaje: 'La cédula es obligatoria.' },
    { clave: 'pattern', mensaje: 'La cédula debe contener solo dígitos.' },
  ];
  erroresTelefono: ErrorCampo[] = [
    { clave: 'required', mensaje: 'El teléfono es obligatorio.' },
    { clave: 'pattern', mensaje: 'El teléfono debe contener solo dígitos.' },
    { clave: 'minlength', mensaje: 'El teléfono debe tener al menos 7 dígitos.' },
  ];

  formulario = input<FormGroup>(new FormGroup({}));
}
