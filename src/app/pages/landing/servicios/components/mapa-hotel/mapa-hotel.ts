import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Servicio } from '../../../../../models/servicio.model';

// Punto del mapa: dónde está el servicio sobre la foto y qué video muestra al tocarlo.
// Posiciones en porcentaje: x de izquierda a derecha, y de arriba hacia abajo.
interface PuntoMapa {
  nombre: string;
  x: number;
  y: number;
  video: string;
}

// Puntos de los servicios sobre la foto del hotel (mapa-hotel.jpg).
const PUNTOS: PuntoMapa[] = [
  { nombre: 'Spa & Bienestar', x: 56, y: 52, video: '/video/registro-spa.mp4' },
  { nombre: 'Restaurante Gourmet', x: 74, y: 58, video: '/video/servicios-restaurante.mp4' },
  { nombre: 'Piscina Infinity', x: 50, y: 72, video: '/video/piscina-noche.mp4' },
  { nombre: 'Playa Privada', x: 50, y: 90, video: '/video/servicios-costa.mp4' },
];

// Mapa interactivo: muestra la foto del hotel con un punto por servicio.
// Al tocar un punto se abre el servicio con su video.
@Component({
  imports: [CurrencyPipe, RouterLink],
  selector: 'app-mapa-hotel',
  templateUrl: './mapa-hotel.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class MapaHotel {
  servicios = input<Servicio[]>([]);
  puntos = PUNTOS;

  // Servicio y video que se muestran en el panel; null mientras no hay selección.
  seleccionado: Servicio | null = null;
  videoSeleccionado: string | null = null;

  // Busca el servicio del catálogo que corresponde a un punto del mapa.
  servicioDe(punto: PuntoMapa): Servicio | undefined {
    return this.servicios().find((servicio) => servicio.nombre === punto.nombre);
  }

  seleccionar(punto: PuntoMapa): void {
    this.seleccionado = this.servicioDe(punto) ?? null;
    this.videoSeleccionado = punto.video;
  }

  cerrar(): void {
    this.seleccionado = null;
    this.videoSeleccionado = null;
  }
}
