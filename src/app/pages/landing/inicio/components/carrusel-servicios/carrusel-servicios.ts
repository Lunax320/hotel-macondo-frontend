import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Servicio } from '../../../../../models/servicio.model';
import { ServicioService } from '../../../../../services/servicio.service';

// Tiempo que cada servicio permanece visible antes de pasar al siguiente.
const INTERVALO_MS = 6000;

@Component({
  imports: [RouterLink],
  selector: 'app-carrusel-servicios',
  templateUrl: './carrusel-servicios.html',
  styleUrl: './carrusel-servicios.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class CarruselServicios implements OnInit {
  private servicioService = inject(ServicioService);

  servicios: Servicio[] = [];
  slideActual: number = 0;
  pausado = signal(false);

  constructor() {
    const destroyRef = inject(DestroyRef);
    // Avanza solo, en bucle, salvo que el cursor o el foco estén sobre el carrusel.
    const id = setInterval(() => {
      if (!this.pausado() && this.servicios.length > 1) {
        this.cambiarSlide((this.slideActual + 1) % this.servicios.length);
      }
    }, INTERVALO_MS);
    destroyRef.onDestroy(() => clearInterval(id));
  }

  // Carga el catálogo de servicios que se presenta en el carrusel.
  ngOnInit(): void {
    this.servicioService.obtenerCatalogoActivo().subscribe({
      next: (servicios) => (this.servicios = servicios),
      error: (err) => console.error('Error al cargar carrusel de servicios:', err),
    });
  }

  // Cambia al servicio indicado y mantiene el índice dentro de sus límites.
  cambiarSlide(indice: number): void {
    const n = this.servicios.length;
    this.slideActual = n === 0 ? 0 : ((indice % n) + n) % n;
  }
}
