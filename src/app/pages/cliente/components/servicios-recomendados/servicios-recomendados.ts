import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Servicio } from '../../../../models/servicio.model';

// Lista de servicios recomendados para el cliente.
@Component({
  imports: [RouterLink],
  selector: 'app-servicios-recomendados',
  templateUrl: './servicios-recomendados.html',
  styleUrl: './servicios-recomendados.scss',
})
export class ServiciosRecomendados {
  recomendaciones = input<Servicio[]>([]);
}
