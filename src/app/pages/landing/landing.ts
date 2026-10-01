import { Component, inject, OnInit } from '@angular/core';
import { TipoHabitacionService } from '../../services/tipo-habitacion.service';
import { TestimonioService } from '../../services/testimonio.service';
import { TipoHabitacion } from '../../models/tipo-habitacion.model';
import { Testimonio } from '../../models/testimonio.model';
import { CarruselServicios } from './components/carrusel-servicios/carrusel-servicios';
import { LandingHero } from './components/landing-hero/landing-hero';
import { BuscadorDisponibilidad } from './components/buscador-disponibilidad/buscador-disponibilidad';
import { LandingHabitaciones } from './components/landing-habitaciones/landing-habitaciones';
import { LandingTestimonios } from './components/landing-testimonios/landing-testimonios';
import { LandingCta } from './components/landing-cta/landing-cta';

@Component({
  imports: [
    LandingHero,
    BuscadorDisponibilidad,
    LandingHabitaciones,
    CarruselServicios,
    LandingTestimonios,
    LandingCta,
  ],
  selector: 'app-landing',
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing implements OnInit {
  private tipoService = inject(TipoHabitacionService);
  private testimonioService = inject(TestimonioService);

  tiposHabitacion: TipoHabitacion[] = [];
  testimonios: Testimonio[] = [];

  ngOnInit(): void {
    this.tiposHabitacion = this.tipoService.obtenerTodos();
    this.testimonios = this.testimonioService.obtenerTodos();
  }
}
