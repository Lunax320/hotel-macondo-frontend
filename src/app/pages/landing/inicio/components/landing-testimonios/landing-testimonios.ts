import { Component, input, OnDestroy, OnInit } from '@angular/core';
import { Testimonio } from '../../../../../models/testimonio.model';
import { TestimonioCard } from '../testimonio-card/testimonio-card';

// Comentarios de muestra. Completan la lista hasta un mínimo para que el carrusel siempre gire.
export const TESTIMONIOS_MUESTRA: Testimonio[] = [
  { id: 1, nombre: 'María Fernanda Rojas', ciudad: 'Bogotá', estrellas: 5, texto: 'Despertar frente al mar fue lo mejor del viaje. El personal nos trató como familia desde el primer día.' },
  { id: 2, nombre: 'Carlos Mendoza', ciudad: 'Medellín', estrellas: 5, texto: 'La habitación impecable y el desayuno junto a la piscina inolvidable. Volveremos el próximo año.' },
  { id: 3, nombre: 'Laura Giraldo', ciudad: 'Cali', estrellas: 4, texto: 'El spa es una maravilla y la atención del restaurante, de primera. Solo faltó más tiempo para quedarnos.' },
  { id: 4, nombre: 'Andrés Villamizar', ciudad: 'Bucaramanga', estrellas: 5, texto: 'Celebramos nuestro aniversario aquí y se encargaron de cada detalle. Una experiencia mágica.' },
  { id: 5, nombre: 'Sofía Herrera', ciudad: 'Barranquilla', estrellas: 5, texto: 'Playa privada, tranquilidad y un servicio muy cálido. Ideal para desconectarse de todo.' },
  { id: 6, nombre: 'Julián Castaño', ciudad: 'Pereira', estrellas: 4, texto: 'Excelente ubicación y habitaciones muy cómodas. El tour guiado superó nuestras expectativas.' },
  { id: 7, nombre: 'Valentina Ortiz', ciudad: 'Cartagena', estrellas: 5, texto: 'Viajé en familia y los niños amaron la piscina. Todo el equipo fue amable y atento.' },
];

// Cuántos comentarios muestra la lista como mínimo, para que el carrusel siempre tenga vuelta.
const MINIMO = 6;
const INTERVALO_MS = 5000;

@Component({
  imports: [TestimonioCard],
  selector: 'app-landing-testimonios',
  styleUrl: './landing-testimonios.scss',
  templateUrl: './landing-testimonios.html',
})
export class LandingTestimonios implements OnInit, OnDestroy {
  testimonios = input<Testimonio[]>();

  // Tarjetas visibles a la vez: 3 en escritorio, 1 en móvil.
  visibles = 3;
  // Posición actual del carrusel.
  indice = 0;
  // true mientras el cursor o el foco están sobre el carrusel: no avanza.
  pausado = false;
  // true si el usuario pidió menos movimiento: no avanza solo.
  private sinMovimiento = false;

  private temporizador?: ReturnType<typeof setInterval>;
  private escritorio?: MediaQueryList;
  private reducido?: MediaQueryList;

  // Comentarios reales primero; si son pocos, se completan con muestra hasta MINIMO.
  get lista(): Testimonio[] {
    const reales = this.testimonios() ?? [];
    const faltan = Math.max(0, MINIMO - reales.length);
    return [...reales, ...TESTIMONIOS_MUESTRA.slice(0, faltan)];
  }

  // Posiciones a las que puede llegar el carrusel: de 0 hasta n - visibles.
  get maxIndice(): number {
    return Math.max(0, this.lista.length - this.visibles);
  }

  get posiciones(): number[] {
    return Array.from({ length: this.maxIndice + 1 }, (_, i) => i);
  }

  // Lee las preferencias de pantalla, escucha sus cambios y arranca el avance automático.
  ngOnInit(): void {
    this.escritorio = window.matchMedia('(min-width: 768px)');
    this.reducido = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.visibles = this.escritorio.matches ? 3 : 1;
    this.sinMovimiento = this.reducido.matches;
    this.escritorio.addEventListener('change', this.alCambiarEscritorio);
    this.reducido.addEventListener('change', this.alCambiarReducido);

    this.temporizador = setInterval(() => {
      if (!this.pausado && !this.sinMovimiento) this.mover(1);
    }, INTERVALO_MS);
  }

  // Quita los escuchas y el temporizador al salir de la página.
  ngOnDestroy(): void {
    clearInterval(this.temporizador);
    this.escritorio?.removeEventListener('change', this.alCambiarEscritorio);
    this.reducido?.removeEventListener('change', this.alCambiarReducido);
  }

  private alCambiarEscritorio = (evento: MediaQueryListEvent): void => {
    this.visibles = evento.matches ? 3 : 1;
    this.indice = 0;
  };

  private alCambiarReducido = (evento: MediaQueryListEvent): void => {
    this.sinMovimiento = evento.matches;
  };

  // Avanza o retrocede una posición y da la vuelta al llegar al final.
  mover(paso: number): void {
    const max = this.maxIndice;
    const siguiente = this.indice + paso;
    if (siguiente > max) {
      this.indice = 0;
    } else if (siguiente < 0) {
      this.indice = max;
    } else {
      this.indice = siguiente;
    }
  }

  ir(posicion: number): void {
    this.indice = posicion;
  }

  // Desplazamiento de la pista en porcentaje de su propio ancho: una tarjeta por paso.
  desplazamiento(): string {
    return `translateX(-${(this.indice * 100) / this.lista.length}%)`;
  }

  // Ancho de la pista: todas las tarjetas, visibles/n del contenedor por tarjeta.
  anchoPista(): string {
    return `${(this.lista.length * 100) / this.visibles}%`;
  }

  anchoSlide(): string {
    return `${100 / this.lista.length}%`;
  }
}
