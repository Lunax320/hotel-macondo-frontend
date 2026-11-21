import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { NODOS_HOTEL, NodoHotel } from '../../../data/nodos-hotel';
import { escenaPorId, PuntoInteres } from '../../../data/escenas';

const PASO_MS = 600;
const GIRO_MS = 700;
const VUELTA = 100;
// Hacia dónde mira la foto de cada nodo (grados en el plano; 0 = +y). Las fotos del pasillo miran a -y.
const FRENTE: Record<string, number> = { habitacion: 0, pasillo: 180, lobby: 0, restaurante: 0, piscina: 0, playa: 0 };
const FUNDIDO_MS = 300;

// Explorar: vista 360 por nodos (estilo Street View) con flechas, minimapa y rutas automáticas.
@Component({
  selector: 'app-explorar',
  templateUrl: './explorar.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class Explorar implements AfterViewInit, OnDestroy {
  @ViewChild('visor') visor?: ElementRef<HTMLElement>;
  readonly nodos: NodoHotel[] = NODOS_HOTEL;
  readonly destinos = [
    { id: 'playa', etiqueta: 'Ir a la playa' },
    { id: 'piscina', etiqueta: 'Ir a la piscina' },
    { id: 'restaurante', etiqueta: 'Ir a restaurante' },
  ];
  // Líneas del minimapa: una por conexión (sin duplicar la vuelta).
  readonly enlaces = NODOS_HOTEL.flatMap((a) =>
    a.conecta
      .map((id) => NODOS_HOTEL.find((n) => n.id === id))
      .filter((b): b is NodoHotel => !!b && a.id < b.id)
      .map((b) => ({ x1: a.x, y1: a.y, x2: b.x, y2: b.y })),
  );
  // viewBox del minimapa con margen, calculado a partir de los nodos.
  readonly vista = (() => {
    const x0 = Math.min(...NODOS_HOTEL.map((n) => n.x - n.ancho / 2)) - 2;
    const y0 = Math.min(...NODOS_HOTEL.map((n) => n.y - n.alto / 2)) - 2;
    const x1 = Math.max(...NODOS_HOTEL.map((n) => n.x + n.ancho / 2)) + 2;
    const y1 = Math.max(...NODOS_HOTEL.map((n) => n.y + n.alto / 2)) + 2;
    return `${x0} ${y0} ${x1 - x0} ${y1 - y0}`;
  })();

  nodo: NodoHotel = this.nodos[0];
  posicion = 0;
  fundiendo = false;
  // Escala de la vista: se acerca al avanzar hacia un nodo (animación básica de caminar).
  zoom = 1;
  caminando = false;
  // Nodos cuya imagen no cargó: se muestra "Escena en preparación".
  readonly fallidas = new Set<string>();

  private arrastrando = false;
  private xInicial = 0;
  private posicionInicial = 0;
  private temporizador: ReturnType<typeof setTimeout> | null = null;
  private temporizadorFundido: ReturnType<typeof setTimeout> | null = null;

  get conectados(): NodoHotel[] {
    return this.nodo.conecta.map((id) => this.porId(id)).filter((n): n is NodoHotel => !!n);
  }

  get posicionFondo(): string {
    return `calc(${-this.posicion / 100} * max(150cqw, 200cqh)) 50%`;
  }

  get sinImagen(): boolean {
    return this.fallidas.has(this.nodo.id);
  }

  ngAfterViewInit(): void {
    // Diferido para no cambiar la vista durante la comprobación de Angular (NG0100).
    setTimeout(() => (this.posicion = this.posicionFrente()));
  }

  // Proporción de la vista respecto a la imagen (la imagen se escala con max(150cqw, 200cqh)).
  private proporcion(): number {
    const el = this.visor?.nativeElement;
    if (!el || el.clientWidth <= 0) return 0.67;
    const W = el.clientWidth;
    const H = el.clientHeight;
    return W / Math.max(1.5 * W, 2 * H);
  }

  // Posición que deja el frente del nodo centrado en la vista.
  private posicionFrente(): number {
    return (0.5 - 0.5 * this.proporcion()) * 100;
  }

  // Flechas en el suelo: aparecen donde está cada vecino respecto a lo que se ve.
  get flechas(): { nodo: NodoHotel; izq: string; escala: number; giro: number }[] {
    if (this.fundiendo) return [];
    const r = this.proporcion();
    const centro = (((this.posicion / 100) + 0.5 * r) % 1 + 1) % 1;
    const frente = FRENTE[this.nodo.id] ?? 0;
    const salida: { nodo: NodoHotel; izq: string; escala: number; giro: number }[] = [];
    for (const n of this.conectados) {
      const rumbo = (Math.atan2(n.x - this.nodo.x, n.y - this.nodo.y) * 180) / Math.PI;
      const relativo = rumbo - frente;
      const fImagen = (((0.5 + relativo / 360) % 1) + 1) % 1;
      let delta = fImagen - centro;
      if (delta > 0.5) delta -= 1;
      if (delta < -0.5) delta += 1;
      let pantalla = 0.5 + delta / r;
      // Fuera de vista: la flecha se pega al borde y apunta hacia donde está el vecino.
      let giro = 0;
      if (pantalla < 0.08) { pantalla = 0.08; giro = -90; }
      else if (pantalla > 0.92) { pantalla = 0.92; giro = 90; }
      const escala = Math.max(0.55, 1 - Math.abs(delta) * 1.2);
      salida.push({ nodo: n, izq: `${(pantalla * 100).toFixed(1)}%`, escala, giro });
    }
    return salida;
  }

  ngOnDestroy(): void {
    this.cancelar();
    if (this.temporizadorFundido !== null) clearTimeout(this.temporizadorFundido);
  }

  iniciarArrastre(e: PointerEvent): void {
    this.arrastrando = true;
    this.xInicial = e.clientX;
    this.posicionInicial = this.posicion;
  }

  arrastrar(e: PointerEvent): void {
    if (!this.arrastrando) return;
    const ancho = (e.currentTarget as HTMLElement).clientWidth;
    if (ancho <= 0) return;
    this.posicion = this.posicionInicial + ((this.xInicial - e.clientX) / ancho) * 40;
  }

  terminarArrastre(): void {
    this.arrastrando = false;
  }

  mover(paso: number): void {
    this.posicion += paso;
  }

  // Puntos de interés del nodo actual (solo las habitaciones los tienen).
  get puntos(): PuntoInteres[] {
    return escenaPorId(this.nodo.id)?.puntos ?? [];
  }

  // Gira la mirada hacia un punto por el camino más corto, con animación suave.
  irAPunto(posicionPunto: number): void {
    const actual = ((this.posicion % VUELTA) + VUELTA) % VUELTA;
    const delta = ((((posicionPunto - actual) % VUELTA) + VUELTA + VUELTA / 2) % VUELTA) - VUELTA / 2;
    const inicio = this.posicion;
    const destino = inicio + delta;
    const t0 = performance.now();
    const paso = (ahora: number) => {
      const f = Math.min(1, (ahora - t0) / GIRO_MS);
      const suave = f < 0.5 ? 2 * f * f : 1 - Math.pow(-2 * f + 2, 2) / 2;
      this.posicion = inicio + (destino - inicio) * suave;
      if (f < 1) requestAnimationFrame(paso);
    };
    requestAnimationFrame(paso);
  }

  // Flecha del suelo: salto manual a un nodo conectado (cancela cualquier ruta en curso).
  irA(id: string): void {
    this.cancelar();
    this.cambiar(id);
  }

  // Ruta más corta (BFS) hasta el destino, avanzando un nodo cada 600 ms.
  rutaA(id: string): void {
    this.cancelar();
    const ruta = this.rutaMasCorta(this.nodo.id, id);
    if (ruta.length < 2) return;
    this.caminando = true;
    let i = 1;
    const paso = () => {
      this.cambiar(ruta[i]);
      i++;
      if (i < ruta.length) this.temporizador = setTimeout(paso, PASO_MS);
      else this.caminando = false;
    };
    paso();
  }

  // BFS sobre "conecta"; devuelve ids del origen al destino ([] si no hay camino).
  rutaMasCorta(origen: string, destino: string): string[] {
    const previo = new Map<string, string | null>([[origen, null]]);
    const cola = [origen];
    while (cola.length) {
      const actual = cola.shift()!;
      if (actual === destino) break;
      for (const vecino of this.porId(actual)?.conecta ?? []) {
        if (!previo.has(vecino) && this.porId(vecino)) {
          previo.set(vecino, actual);
          cola.push(vecino);
        }
      }
    }
    if (!previo.has(destino)) return [];
    const ruta: string[] = [];
    for (let n: string | null = destino; n !== null; n = previo.get(n) ?? null) ruta.unshift(n);
    return ruta;
  }

  imagenFallo(): void {
    this.fallidas.add(this.nodo.id);
  }

  // Posición de la flecha según la dirección del vecino en el plano (arriba del plano = adelante).
  estiloFlecha(n: NodoHotel): Record<string, string> {
    const dx = n.x - this.nodo.x;
    const dy = n.y - this.nodo.y;
    const largo = Math.hypot(dx, dy) || 1;
    return { left: `${50 + (dx / largo) * 30}%`, bottom: `${18 + ((-dy / largo + 1) / 2) * 14}%` };
  }

  private cambiar(id: string): void {
    const destino = this.porId(id);
    if (!destino || destino.id === this.nodo.id) return;
    if (this.temporizadorFundido !== null) clearTimeout(this.temporizadorFundido);
    // Animación básica: se acerca hacia el destino y luego entra al nodo nuevo.
    this.zoom = 1.3;
    this.fundiendo = true;
    this.temporizadorFundido = setTimeout(() => {
      this.nodo = destino;
      this.posicion = this.posicionFrente();
      this.fundiendo = false;
      this.zoom = 1;
      this.temporizadorFundido = null;
    }, FUNDIDO_MS);
  }

  private cancelar(): void {
    if (this.temporizador !== null) clearTimeout(this.temporizador);
    this.temporizador = null;
    this.caminando = false;
  }

  private porId(id: string): NodoHotel | undefined {
    return this.nodos.find((n) => n.id === id);
  }
}
