import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TipoHabitacionService } from '../../services/tipo-habitacion.service';
import { TestimonioService } from '../../services/testimonio.service';
import { TipoHabitacion } from '../../models/tipo-habitacion.model';
import { Testimonio } from '../../models/testimonio.model';
import { CarruselServicios } from './components/carrusel-servicios/carrusel-servicios';

@Component({
  imports: [RouterLink, CarruselServicios],
  selector: 'app-landing',
  templateUrl: './landing.html',
  styleUrl: './landing.scss'
})
export class Landing implements OnInit {
  private tipoService = inject(TipoHabitacionService);
  private testimonioService = inject(TestimonioService);

  tiposHabitacion: TipoHabitacion[] = [];
  testimonios: Testimonio[] = [];

  // Control nativo de fechas para el buscador
  fechaEntradaMin: string = new Date().toISOString().split('T')[0];
  fechaSalidaMin: string = '';

  ngOnInit(): void {
    this.tiposHabitacion = this.tipoService.obtenerTodos();
    this.testimonios = this.testimonioService.obtenerTodos();
  }

  onEntradaChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.fechaSalidaMin = input.value;
  }
}