import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { TipoHabitacionService } from '../../../services/tipo-habitacion.service';
import { TestimonioService } from '../../../services/testimonio.service';
import { TipoHabitacion } from '../../../models/tipo-habitacion.model';
import { Testimonio } from '../../../models/testimonio.model';
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
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class Landing implements OnInit {
  private tipoService = inject(TipoHabitacionService);
  private testimonioService = inject(TestimonioService);

  tiposHabitacion: TipoHabitacion[] = [];
  testimonios: Testimonio[] = [];

  // Carga los datos iniciales que necesita la página de inicio.
  ngOnInit(): void {
    this.tipoService.obtenerTodos().subscribe({
      next: (tipos) => (this.tiposHabitacion = tipos),
      error: (err) => console.error('Error al cargar tipos de habitacion:', err),
    });

    this.testimonioService.obtenerTodos().subscribe({
      next: (testimonios) => (this.testimonios = testimonios),
      error: (err) => console.error('Error al cargar testimonios:', err),
    });
  }
}