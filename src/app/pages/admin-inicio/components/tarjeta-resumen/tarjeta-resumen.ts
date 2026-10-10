import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

// Tarjeta del tablero admin: etiqueta, icono, valor principal y detalle con un número resaltado.
@Component({
  imports: [RouterLink],
  selector: 'app-tarjeta-resumen',
  templateUrl: './tarjeta-resumen.html',
  styleUrl: './tarjeta-resumen.scss',
})
export class TarjetaResumen {
  etiqueta = input('');
  icono = input('');
  valor = input<number | string>('');
  // Tamaño del valor principal (la tarjeta de tipos usa texto en vez de número).
  claseValor = input('text-4xl');
  detallePrefijo = input('');
  // Número que se muestra en negrita dentro del detalle; null si no lleva.
  detalleValor = input<number | null>(null);
  detalleSufijo = input('');
  enlace = input('');
}
