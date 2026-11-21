import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Servicio } from '../../../../../models/servicio.model';
import { ServicioService } from '../../../../../services/servicio.service';
import { ToastService } from '../../../../../services/toast.service';

// Tiempo que cada servicio permanece visible antes de pasar al siguiente.
const INTERVALO_MS = 6000;

@Component({
  imports: [RouterLink],
  selector: 'app-carrusel-servicios',
  templateUrl: './carrusel-servicios.html',
  styleUrl: './carrusel-servicios.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class CarruselServicios implements OnInit, OnDestroy {
  private servicioService = inject(ServicioService);
  private toast = inject(ToastService);

  servicios: Servicio[] = [];
  slideActual: number = 0;
  // true mientras el cursor o el foco están sobre el carrusel: no avanza.
  pausado = false;
  private temporizador?: ReturnType<typeof setInterval>;

  // Carga el catálogo y arranca el avance automático en bucle.
  ngOnInit(): void {
    this.servicioService.obtenerCatalogoActivo().subscribe({
      next: (servicios) => (this.servicios = servicios),
      error: () => this.toast.mostrar('No fue posible cargar los servicios destacados.', 'error'),
    });

    this.temporizador = setInterval(() => {
      if (!this.pausado && this.servicios.length > 1) {
        this.cambiarSlide((this.slideActual + 1) % this.servicios.length);
      }
    }, INTERVALO_MS);
  }

  // Detiene el temporizador al salir de la página para no dejarlo corriendo.
  ngOnDestroy(): void {
    clearInterval(this.temporizador);
  }

  // Cambia al servicio indicado y mantiene el índice dentro de sus límites.
  cambiarSlide(indice: number): void {
    const n = this.servicios.length;
    this.slideActual = n === 0 ? 0 : ((indice % n) + n) % n;
  }
}
