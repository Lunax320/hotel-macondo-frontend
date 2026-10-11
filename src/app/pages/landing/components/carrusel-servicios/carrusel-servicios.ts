import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Servicio } from '../../../../models/servicio.model';
import { ServicioService } from '../../../../services/servicio.service';

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

  ngOnInit(): void {
    this.servicioService.obtenerCatalogoActivo().subscribe({
      next: (servicios) => (this.servicios = servicios),
      error: (err) => console.error('Error al cargar carrusel de servicios:', err),
    });
  }

  cambiarSlide(indice: number): void {
    this.slideActual = indice;
  }
}