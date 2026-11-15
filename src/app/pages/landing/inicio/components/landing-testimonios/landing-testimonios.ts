import { Component, computed, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
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
export class LandingTestimonios implements OnInit {
  testimonios = input<Testimonio[]>();

  // Comentarios reales primero; si son pocos, se completan con muestra hasta MINIMO.
  lista = computed<Testimonio[]>(() => {
    const reales = this.testimonios() ?? [];
    const faltan = Math.max(0, MINIMO - reales.length);
    return [...reales, ...TESTIMONIOS_MUESTRA.slice(0, faltan)];
  });

  // Tarjetas visibles a la vez: 3 en escritorio, 1 en móvil.
  visibles = signal(3);
  // Posiciones a las que puede llegar el carrusel: de 0 hasta n - visibles.
  maxIndice = computed(() => Math.max(0, this.lista().length - this.visibles()));
  posiciones = computed(() => Array.from({ length: this.maxIndice() + 1 }, (_, i) => i));

  indice = signal(0);
  pausado = signal(false);
  private sinMovimiento = signal(false);

  constructor() {
    const destroyRef = inject(DestroyRef);
    const id = setInterval(() => {
      if (!this.pausado() && !this.sinMovimiento()) this.mover(1);
    }, INTERVALO_MS);
    destroyRef.onDestroy(() => clearInterval(id));
  }

  ngOnInit(): void {
    const escritorio = window.matchMedia('(min-width: 768px)');
    const reducido = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.visibles.set(escritorio.matches ? 3 : 1);
    this.sinMovimiento.set(reducido.matches);
    escritorio.addEventListener('change', (e) => {
      this.visibles.set(e.matches ? 3 : 1);
      this.indice.set(0);
    });
    reducido.addEventListener('change', (e) => this.sinMovimiento.set(e.matches));
  }

  // Avanza o retrocede una posición y da la vuelta al llegar al final.
  mover(paso: number): void {
    const max = this.maxIndice();
    this.indice.update((i) => {
      const siguiente = i + paso;
      if (siguiente > max) return 0;
      if (siguiente < 0) return max;
      return siguiente;
    });
  }

  ir(posicion: number): void {
    this.indice.set(posicion);
  }

  // Desplazamiento de la pista en porcentaje de su propio ancho: una tarjeta por paso.
  desplazamiento(): string {
    return `translateX(-${(this.indice() * 100) / this.lista().length}%)`;
  }

  // Ancho de la pista: todas las tarjetas, visibles/n del contenedor por tarjeta.
  anchoPista(): string {
    return `${(this.lista().length * 100) / this.visibles()}%`;
  }

  anchoSlide(): string {
    return `${100 / this.lista().length}%`;
  }
}
