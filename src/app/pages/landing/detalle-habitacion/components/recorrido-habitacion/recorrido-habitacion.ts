import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TipoHabitacion } from '../../../../../models/tipo-habitacion.model';

// Imagen panorámica de cada tipo de habitación (carpeta public/images).
const PANORAMICAS: Record<string, string> = {
  Estándar: '/images/habitacion-estandar-panoramica.jpg',
  VIP: '/images/habitacion-vip-panoramica.jpg',
  Executive: '/images/habitacion-ejecutiva-panoramica.jpg',
  Suite: '/images/habitacion-luxury-panoramica.jpg',
};

// Recorrido de la habitación: el visitante mueve un deslizador y la panorámica se desplaza.
@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-recorrido-habitacion',
  templateUrl: './recorrido-habitacion.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class RecorridoHabitacion {
  tipo = input.required<TipoHabitacion>();

  // Posición del recorrido, de 0 (inicio) a 100 (final).
  posicion = new FormControl(0, { nonNullable: true });

  // Imagen del tipo; null si ese tipo no tiene panorámica (entonces no se muestra la sección).
  get panoramica(): string | null {
    return PANORAMICAS[this.tipo().nombre] ?? null;
  }

  // La imagen mide el doble del contenedor; moverla hasta la mitad de su ancho recorre todo.
  get desplazamiento(): string {
    return `translateX(-${this.posicion.value / 2}%)`;
  }
}
