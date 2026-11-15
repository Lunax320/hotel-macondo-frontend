import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TipoHabitacion } from '../../../../../models/tipo-habitacion.model';

// Panorámica de cada tipo, generada a partir de la foto que el tipo usa en el catálogo.
// Superior comparte la foto de Executive, y Suite la de VIP (así lo muestra el backend).
const PANORAMICAS: Record<string, string> = {
  Estándar: '/images/habitacion-estandar-panoramica.jpg',
  Superior: '/images/habitacion-ejecutiva-panoramica.jpg',
  Suite: '/images/habitacion-vip-panoramica.jpg',
  Executive: '/images/habitacion-ejecutiva-panoramica.jpg',
  VIP: '/images/habitacion-luxury-panoramica.jpg',
};

// Recorrido de la habitación: el visitante arrastra sobre la imagen (o usa las flechas del teclado).
@Component({
  selector: 'app-recorrido-habitacion',
  templateUrl: './recorrido-habitacion.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class RecorridoHabitacion {
  tipo = input.required<TipoHabitacion>();

  // Posición del recorrido, de 0 (inicio) a 100 (final).
  posicion = 0;
  private arrastrando = false;
  private xInicial = 0;
  private posicionInicial = 0;

  // Imagen del tipo; null si ese tipo no tiene panorámica (entonces no se muestra la sección).
  get panoramica(): string | null {
    return PANORAMICAS[this.tipo().nombre] ?? null;
  }

  // La imagen mide el doble del contenedor; desplazarla hasta la mitad de su ancho recorre todo.
  get desplazamiento(): string {
    return `translateX(-${this.posicion / 2}%)`;
  }

  // Empieza a arrastrar: guarda dónde está el dedo o el mouse.
  iniciarArrastre(evento: PointerEvent): void {
    this.arrastrando = true;
    this.xInicial = evento.clientX;
    this.posicionInicial = this.posicion;
  }

  // Mientras se arrastra, la posición sigue el movimiento (un ancho completo = recorrido completo).
  arrastrar(evento: PointerEvent): void {
    if (!this.arrastrando) return;
    const ancho = (evento.currentTarget as HTMLElement).clientWidth;
    const desplazado = ((this.xInicial - evento.clientX) / ancho) * 100;
    this.fijarPosicion(this.posicionInicial + desplazado);
  }

  terminarArrastre(): void {
    this.arrastrando = false;
  }

  // Con teclado: las flechas izquierda y derecha mueven el recorrido.
  mover(paso: number): void {
    this.fijarPosicion(this.posicion + paso);
  }

  // Mantiene la posición entre 0 y 100.
  private fijarPosicion(valor: number): void {
    this.posicion = Math.min(100, Math.max(0, valor));
  }
}
