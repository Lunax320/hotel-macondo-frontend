import { Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  CampoFormulario,
  ErrorCampo,
} from '../../../../components/campo-formulario/campo-formulario';

// Formulario para agregar un operador.
@Component({
  imports: [ReactiveFormsModule, CampoFormulario],
  selector: 'app-operador-formulario',
  templateUrl: './operador-formulario.html',
  styleUrl: './operador-formulario.scss',
})
export class OperadorFormulario {
  // Mensajes de error para el campo nombre.
  erroresNombre: ErrorCampo[] = [
    { clave: 'required', mensaje: 'El nombre es obligatorio.' },
    { clave: 'maxlength', mensaje: 'El nombre puede tener máximo 100 caracteres.' },
  ];

  formulario = input<FormGroup>(new FormGroup({}));
  agregar = output<void>();
}
