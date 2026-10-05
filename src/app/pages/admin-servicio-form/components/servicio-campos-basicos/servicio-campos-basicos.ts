import { Component, input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  CampoFormulario,
  ErrorCampo,
} from '../../../../components/campo-formulario/campo-formulario';

// Campos de nombre, categoría y descripciones del servicio.
@Component({
  imports: [CampoFormulario],
  selector: 'app-servicio-campos-basicos',
  styleUrl: './servicio-campos-basicos.scss',
  templateUrl: './servicio-campos-basicos.html',
})
export class ServicioCamposBasicos {
  // Mensajes que se muestran según el error de cada campo.
  erroresNombre: ErrorCampo[] = [
    { clave: 'required', mensaje: 'El nombre es obligatorio.' },
    { clave: 'minlength', mensaje: 'El nombre debe tener al menos 3 caracteres.' },
    { clave: 'maxlength', mensaje: 'El nombre puede tener máximo 100 caracteres.' },
  ];
  erroresCategoria: ErrorCampo[] = [{ clave: 'required', mensaje: 'La categoría es obligatoria.' }];
  erroresDescripcion: ErrorCampo[] = [
    { clave: 'required', mensaje: 'La descripción es obligatoria.' },
    { clave: 'maxlength', mensaje: 'La descripción puede tener máximo 500 caracteres.' },
  ];

  formulario = input<FormGroup>(new FormGroup({}));
  categorias = input<string[]>([]);
}
