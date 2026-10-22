import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { Servicio } from '../../../models/servicio.model';
import { ServicioService } from '../../../services/servicio.service';
import { ResumenServicio } from './components/resumen-servicio/resumen-servicio';
import { ServicioRelacionadoCard } from './components/servicio-relacionado-card/servicio-relacionado-card';

@Component({
  imports: [RouterLink, ResumenServicio, ServicioRelacionadoCard],
  selector: 'app-detalle-servicio',
  styleUrl: './detalle-servicio.scss',
  templateUrl: './detalle-servicio.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class DetalleServicio implements OnInit {
  private route = inject(ActivatedRoute);
  private servicioService = inject(ServicioService);

  servicio?: Servicio;
  serviciosRelacionados: Servicio[] = [];

  servicioAgregado = false;
  serviciosAgregados: number[] = [];

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const id = Number(params.get('id'));
          return this.servicioService.obtenerPorId(id);
        })
      )
      .subscribe({
        next: (servicio) => {
          this.servicio = servicio;
          if (servicio && servicio.id) {
            this.servicioAgregado = this.serviciosAgregados.includes(servicio.id);
            this.cargarRelacionados(servicio.id);
          }
        },
        error: (err) => console.error('Error al cargar detalle de servicio:', err),
      });
  }

  alternarServicio(id: number): void {
    if (this.serviciosAgregados.includes(id)) {
      this.serviciosAgregados = this.serviciosAgregados.filter((item) => item !== id);
    } else {
      this.serviciosAgregados = [...this.serviciosAgregados, id];
    }

    if (this.servicio && this.servicio.id === id) {
      this.servicioAgregado = this.serviciosAgregados.includes(id);
    }
  }

  private cargarRelacionados(id: number): void {
    this.servicioService.obtenerRelacionados(id).subscribe({
      next: (relacionados) => (this.serviciosRelacionados = relacionados),
      error: (err) => console.error('Error al cargar servicios relacionados:', err),
    });
  }
}