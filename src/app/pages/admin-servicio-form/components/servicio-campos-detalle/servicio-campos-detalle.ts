import { Component, input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  CampoFormulario,
  ErrorCampo,
} from '../../../../components/campo-formulario/campo-formulario';

// Campos de imagen, precio, duración y horario del servicio.
@Component({
  imports: [CampoFormulario],
  selector: 'app-servicio-campos-detalle',
  styleUrl: './servicio-campos-detalle.scss',
  templateUrl: './servicio-campos-detalle.html',
})
export class ServicioCamposDetalle {
  // Mensajes que se muestran según el error de cada campo.
  erroresImagen: ErrorCampo[] = [{ clave: 'required', mensaje: 'La imagen es obligatoria.' }];
  erroresPrecio: ErrorCampo[] = [
    { clave: 'required', mensaje: 'El precio es obligatorio.' },
    { clave: 'min', mensaje: 'El precio debe ser mayor o igual a cero.' },
  ];

  formulario = input<FormGroup>(new FormGroup({}));
  imagenesDisponibles = input<string[]>([]);
}
