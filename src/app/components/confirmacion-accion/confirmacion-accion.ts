import { Component, input, output } from '@angular/core';

// Solicita confirmación antes de ejecutar una acción irreversible.
@Component({
  selector: 'app-confirmacion-accion',
  templateUrl: './confirmacion-accion.html',
  styleUrl: './confirmacion-accion.scss',
})
export class ConfirmacionAccion {
  titulo = input('');
  mensaje = input('');
  textoConfirmar = input('');
  textoCancelar = input('');
  confirmado = output<void>();
  cancelado = output<void>();
}
