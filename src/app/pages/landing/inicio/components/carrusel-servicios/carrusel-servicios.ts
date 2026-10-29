import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Servicio } from '../../../../../models/servicio.model';
import { ServicioService } from '../../../../../services/servicio.service';

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

  // Carga el catálogo de servicios que se presenta en el carrusel.
  ngOnInit(): void {
    this.servicioService.obtenerCatalogoActivo().subscribe({
      next: (servicios) => (this.servicios = servicios),
      error: (err) => console.error('Error al cargar carrusel de servicios:', err),
    });
  }

  // Avanza o retrocede el carrusel y mantiene el índice dentro de sus límites.
  cambiarSlide(indice: number): void {
    this.slideActual = indice;
  }
}