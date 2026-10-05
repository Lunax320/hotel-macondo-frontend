import { Component, input } from '@angular/core';
// Muestra el mensaje de validación de un campo de formulario.
@Component({
  selector: 'app-mensaje-error-campo',
  templateUrl: './mensaje-error-campo.html',
  styleUrl: './mensaje-error-campo.scss',
})
export class MensajeErrorCampo {
  mostrar = input(false);
  mensaje = input('');
}
