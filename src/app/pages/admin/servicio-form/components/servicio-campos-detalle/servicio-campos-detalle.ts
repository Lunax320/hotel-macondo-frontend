import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CampoFormulario } from '../../../../../components/campo-formulario/campo-formulario';
import { ErrorCampo } from '../../../../../models/error-campo.model';

// Campos de imagen, precio, duración y horario del servicio.
@Component({
  imports: [ReactiveFormsModule, CampoFormulario],
  selector: 'app-servicio-campos-detalle',
  styleUrl: './servicio-campos-detalle.scss',
  templateUrl: './servicio-campos-detalle.html',
})
export class ServicioCamposDetalle {
  // Mensajes que se muestran según el error de cada campo.
  erroresPrecio: ErrorCampo[] = [
    { clave: 'required', mensaje: 'El precio es obligatorio.' },
    { clave: 'min', mensaje: 'El precio debe ser mayor o igual a cero.' },
  ];

  formulario = input<FormGroup>(new FormGroup({}));
  imagenesDisponibles = input<string[]>([]);

  // Nombre legible de la imagen: "/images/PlayaPriv.avif" -> "Playa privada".
  private readonly nombresLegibles: Record<string, string> = {
    PlayaPriv: 'Playa privada',
    Spa: 'Spa',
    Restaurante: 'Restaurante',
    Piscina: 'Piscina',
    Guiado: 'Guiado',
    Eventos: 'Eventos',
  };

  nombreImagen(ruta: string): string {
    const base = (ruta.split('/').pop() ?? ruta).replace(/\.[^.]+$/, '');
    return this.nombresLegibles[base] ?? base;
  }
}
