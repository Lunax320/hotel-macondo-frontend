import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-reserva-instrucciones',
  imports: [RouterLink],
  templateUrl: './reserva-instrucciones.html',
})
export class ReservaInstrucciones {
  clienteId = input.required<number>();
}