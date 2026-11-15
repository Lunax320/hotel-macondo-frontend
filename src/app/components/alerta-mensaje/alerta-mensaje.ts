import { Component, input } from '@angular/core';

// Muestra un aviso visual de error o de éxito.
@Component({
  selector: 'app-alerta-mensaje',
  templateUrl: './alerta-mensaje.html',
  styleUrl: './alerta-mensaje.scss',
})
export class AlertaMensaje {
  mensaje = input('');
  tipo = input<'error' | 'exito'>('error');
}
