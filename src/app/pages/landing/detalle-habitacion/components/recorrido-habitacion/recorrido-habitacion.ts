import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  input,
  isDevMode,
} from '@angular/core';
import { TipoHabitacion } from '../../../../../models/tipo-habitacion.model';

// Una panorámica distinta por tipo de habitación (carpeta public/images).
// Suite usa la foto de VIP y VIP la de Luxury, como las muestra el backend.
const PANORAMICAS: Record<string, string> = {
  Estándar: '/images/habitacion-estandar-360.png',
  Superior: '/images/habitacion-superior-360.png',
  Suite: '/images/habitacion-suite-360.png',
  Executive: '/images/habitacion-ejecutiva-360.png',
  VIP: '/images/habitacion-vip-360.png',
};

export interface Escena {
  id: string;
  imagen: string;
  titulo: string;
  x: number;
}

const VUELTA = 100;
const DURACION_FUNDIDO_MS = 300;

export function normalizarPosicion(valor: number): number {
  if (!Number.isFinite(valor)) return 0;
  return ((valor % VUELTA) + VUELTA) % VUELTA;
}

export function verificarLogicaPosicion(): void {
  const casos: ReadonlyArray<readonly [number, number]> = [
    [0, 0],
    [100, 0],
    [105, 5],
    [-5, 95],
    [250, 50],
    [-205, 95],
  ];
  for (const [entrada, esperado] of casos) {
    const obtenido = normalizarPosicion(entrada);
    if (obtenido !== esperado) {
      throw new Error(
        `Posición incorrecta para ${entrada}: se esperaba ${esperado} y se obtuvo ${obtenido}`,
      );
    }
  }
}

// Recorrido de la habitación: el visitante arrastra sobre la imagen (o usa las flechas del teclado).
@Component({
  selector: 'app-recorrido-habitacion',
  templateUrl: './recorrido-habitacion.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class RecorridoHabitacion implements OnDestroy {
  tipo = input.required<TipoHabitacion>();
  escenas = input<Escena[]>([]);

  // Posición del recorrido, de 0 a 100; al pasar el final continúa desde el inicio.
  posicion = 0;
  indiceEscena = 0;
  fundiendo = false;

  private arrastrando = false;
  private xInicial = 0;
  private posicionInicial = 0;
  private temporizador: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    if (isDevMode()) verificarLogicaPosicion();
  }

  ngOnDestroy(): void {
    if (this.temporizador !== null) clearTimeout(this.temporizador);
  }

  // Imagen de la escena activa o del tipo; null si no hay panorámica (no se muestra la sección).
  get imagenActual(): string | null {
    return this.escenaActual?.imagen ?? this.panoramica;
  }

  get escenaActual(): Escena | null {
    const escenas = this.escenas();
    if (escenas.length === 0) return null;
    return escenas[this.indiceEscena] ?? escenas[0] ?? null;
  }

  get textoAlternativo(): string {
    return this.escenaActual
      ? `Vista panorámica de ${this.escenaActual.titulo}`
      : `Vista panorámica de la habitación ${this.tipo().nombre}`;
  }

  get panoramica(): string | null {
    return PANORAMICAS[this.tipo().nombre] ?? null;
  }

  // Dos copias de la imagen ocupan el 200% del contenedor: desplazar la mitad recorre una vuelta.
  get desplazamiento(): string {
    return `translateX(-${this.posicion / 2}%)`;
  }

  claseBoton(indice: number): string {
    const base =
      'rounded-full border border-[var(--azul)] px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--azul)]';
    return indice === this.indiceEscena
      ? `${base} bg-[var(--azul)] text-white`
      : `${base} bg-white text-[var(--azul-oscuro)] hover:bg-[var(--azul)] hover:text-white`;
  }

  seleccionarEscena(indice: number): void {
    const escena = this.escenas()[indice];
    if (!escena || indice === this.indiceEscena) return;

    if (this.temporizador !== null) clearTimeout(this.temporizador);
    this.fundiendo = true;
    this.temporizador = setTimeout(() => {
      this.indiceEscena = indice;
      this.posicion = normalizarPosicion(escena.x);
      this.fundiendo = false;
      this.temporizador = null;
    }, DURACION_FUNDIDO_MS);
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
    if (ancho <= 0) return;
    const desplazado = ((this.xInicial - evento.clientX) / ancho) * VUELTA;
    this.fijarPosicion(this.posicionInicial + desplazado);
  }

  terminarArrastre(): void {
    this.arrastrando = false;
  }

  // Con teclado: las flechas izquierda y derecha mueven el recorrido.
  mover(paso: number): void {
    this.fijarPosicion(this.posicion + paso);
  }

  // Envuelve la posición para que el borde derecho continúe con el inicio de la imagen.
  private fijarPosicion(valor: number): void {
    this.posicion = normalizarPosicion(valor);
  }
}
