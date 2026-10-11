import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-historial-vacio-banner',
  imports: [RouterLink],
  templateUrl: './historial-vacio-banner.html',
})
export class HistorialVacioBanner {
  clienteId = input.required<number>();
}