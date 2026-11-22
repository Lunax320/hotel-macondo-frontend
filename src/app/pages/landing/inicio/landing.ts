import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TipoHabitacionService } from '../../../services/tipo-habitacion.service';
import { TestimonioService } from '../../../services/testimonio.service';
import { ComentarioService } from '../../../services/comentario.service';
import { ToastService } from '../../../services/toast.service';
import { TipoHabitacion } from '../../../models/tipo-habitacion.model';
import { Testimonio } from '../../../models/testimonio.model';
import { CarruselServicios } from './components/carrusel-servicios/carrusel-servicios';
import { LandingHero } from './components/landing-hero/landing-hero';
import { BuscadorDisponibilidad } from './components/buscador-disponibilidad/buscador-disponibilidad';
import { LandingHabitaciones } from './components/landing-habitaciones/landing-habitaciones';
import { LandingTestimonios } from './components/landing-testimonios/landing-testimonios';
import { LandingCta } from './components/landing-cta/landing-cta';
import { LandingRecorrido } from './components/landing-recorrido/landing-recorrido';
import { Promocion } from '../../../models/promocion.model';
import { PromocionService } from '../../../services/promocion.service';
import { RouterLink } from '@angular/router';

@Component({
  imports: [
    LandingHero,
    BuscadorDisponibilidad,
    LandingHabitaciones,
    CarruselServicios,
    LandingTestimonios,
    LandingCta,
    LandingRecorrido,
    RouterLink,
    CommonModule,
  ],
  selector: 'app-landing',
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class Landing implements OnInit {
  private tipoService = inject(TipoHabitacionService);
  private testimonioService = inject(TestimonioService);
  private comentarioService = inject(ComentarioService);
  private toast = inject(ToastService);
  private promocionesService = inject(PromocionService);

  tiposHabitacion: TipoHabitacion[] = [];
  testimonios: Testimonio[] = [];
  promociones: Promocion[] = [];

  // Carga los datos iniciales que necesita la página de inicio.
  ngOnInit(): void {
    this.promocionesService.publicas().subscribe({ next: (items) => this.promociones = items.slice(0, 3) });
    this.tipoService.obtenerTodos().subscribe({
      next: (tipos) => (this.tiposHabitacion = tipos),
      error: () => this.toast.mostrar('No fue posible cargar los tipos de habitación.', 'error'),
    });

    // Comentarios publicados por el administrador; si no hay o falla, se usan los testimonios del backend.
    this.comentarioService.publicados().subscribe({
      next: (comentarios) => {
        if (comentarios.length > 0) {
          this.testimonios = comentarios.map((c) => ({
            id: c.id,
            texto: c.texto,
            nombre: c.nombre,
            ciudad: new Date(c.fechaCreacion).toLocaleDateString('es-CO', { dateStyle: 'long' }),
            estrellas: c.calificacion,
          }));
        } else {
          this.cargarTestimoniosBackend();
        }
      },
      error: () => this.cargarTestimoniosBackend(),
    });
  }

  private cargarTestimoniosBackend(): void {
    this.testimonioService.obtenerTodos().subscribe({
      next: (testimonios) => (this.testimonios = testimonios),
      error: () => this.toast.mostrar('No fue posible cargar los testimonios.', 'error'),
    });
  }
}
