import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MensajeErrorCampo } from '../mensaje-error-campo/mensaje-error-campo';

// Mensaje que se muestra cuando el control tiene ese error (required, minlength, pattern, email...).
export interface ErrorCampo {
  clave: string;
  mensaje: string;
}

// Un campo de formulario reutilizable: etiqueta + input/textarea/select + sus mensajes de error.
// Recibe el FormGroup del formulario padre y el nombre del control que debe pintar.
@Component({
  imports: [ReactiveFormsModule, MensajeErrorCampo],
  selector: 'app-campo-formulario',
  styleUrl: './campo-formulario.scss',
  templateUrl: './campo-formulario.html',
})
export class CampoFormulario {
  formulario = input<FormGroup>(new FormGroup({}));
  nombreCampo = input('');
  etiqueta = input('');
  tipo = input('text');
  placeholder = input('');
  // Si se pasa un ícono (ej. 'bi-person') el input se pinta con ícono a la izquierda.
  icono = input('');
  // Si filas > 0 se pinta un textarea.
  filas = input(0);
  // Si hay opciones se pinta un select.
  opciones = input<string[]>([]);
  textoOpcionVacia = input('Seleccionar...');
  errores = input<ErrorCampo[]>([]);

  // Los errores se muestran apenas el usuario toca o escribe en el campo.
  mostrarErrores(): boolean {
    const control = this.formulario().get(this.nombreCampo());
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  tieneError(clave: string): boolean {
    return !!this.formulario().get(this.nombreCampo())?.errors?.[clave];
  }
}
