import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ServicioService } from '../../../../services/servicio.service';
import { Servicio } from '../../../../models/servicio.model';

@Component({
  imports: [RouterLink],
  selector: 'app-carrusel-servicios',
  templateUrl: './carrusel-servicios.html',
  styleUrl: './carrusel-servicios.scss',
})
export class CarruselServicios implements OnInit, OnDestroy {
  private servicioService = inject(ServicioService);

  servicios: Servicio[] = [];
  slideActual: number = 0;
  private intervaloAutoPlay: any;

  ngOnInit(): void {
    this.servicios = this.servicioService.obtenerTodos();
    this.iniciarAutoPlay();
  }

  ngOnDestroy(): void {
    this.detenerAutoPlay();
  }

  cambiarSlide(nuevoIndex: number): void {
    this.slideActual = nuevoIndex;
    this.reiniciarAutoPlay();
  }

  private avanzar(): void {
    if (this.servicios.length > 0) {
      this.slideActual = (this.slideActual + 1) % this.servicios.length;
    }
  }

  private iniciarAutoPlay(): void {
    this.intervaloAutoPlay = setInterval(() => {
      this.avanzar();
    }, 5000);
  }

  private detenerAutoPlay(): void {
    if (this.intervaloAutoPlay) {
      clearInterval(this.intervaloAutoPlay);
    }
  }

  private reiniciarAutoPlay(): void {
    this.detenerAutoPlay();
    this.iniciarAutoPlay();
  }
}
