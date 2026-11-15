import { CurrencyPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Servicio } from '../../../../../models/servicio.model';

@Component({
  imports: [CurrencyPipe, RouterLink],
  selector: 'app-servicio-card',
  styleUrl: './servicio-card.scss',
  templateUrl: './servicio-card.html',
})
export class ServicioCard {
  servicio = input.required<Servicio>();
  agregado = input(false);
  alternarAgregado = output<number>();

  // Clip de video que se reproduce al pasar el cursor; sin entrada se muestra la foto fija.
  private readonly videos: Record<string, string> = {
    'Spa & Bienestar': '/video/registro-spa.mp4',
    'Restaurante Gourmet': '/video/servicios-restaurante.mp4',
    'Piscina Infinity': '/video/piscina-noche.mp4',
    'Playa Privada': '/video/servicios-costa.mp4',
  };

  // Devuelve la ruta del video del servicio, o null si solo tiene foto.
  videoDe(nombre: string): string | null {
    return this.videos[nombre] ?? null;
  }

  // Emite el cambio de selección de este servicio.
  alternar(): void {
    const id = this.servicio().id;

    if (id !== undefined) {
      this.alternarAgregado.emit(id);
    }
  }
}
