import { Component, input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CampoFormulario } from '../../../../components/campo-formulario/campo-formulario';

// Campos de incluidos, etiquetas, destacado y activo del servicio.
@Component({
  imports: [ReactiveFormsModule, CampoFormulario],
  selector: 'app-servicio-campos-extra',
  styleUrl: './servicio-campos-extra.scss',
  templateUrl: './servicio-campos-extra.html',
})
export class ServicioCamposExtra {
  formulario = input<FormGroup>(new FormGroup({}));
}
