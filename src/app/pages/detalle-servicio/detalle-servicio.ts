import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Servicio } from '../../models/servicio.model';
import { ServicioService } from '../../services/servicio.service';
import { ResumenServicio } from './components/resumen-servicio/resumen-servicio';
import { ServicioRelacionadoCard } from './components/servicio-relacionado-card/servicio-relacionado-card';

@Component({
  imports: [RouterLink, ResumenServicio, ServicioRelacionadoCard],
  selector: 'app-detalle-servicio',
  styleUrl: './detalle-servicio.scss',
  templateUrl: './detalle-servicio.html',
})
export class DetalleServicio implements OnInit {
  private route = inject(ActivatedRoute);
  private servicioService = inject(ServicioService);

  servicio?: Servicio;
  serviciosRelacionados: Servicio[] = [];
  servicioAgregado = false;

  ngOnInit(): void {
    this.route.paramMap.subscribe((parametros) => {
      const id = Number(parametros.get('id'));
      this.cargarServicio(id);
    });
  }

  alternarServicio(id: number): void {
    if (this.servicio?.id === id) {
      this.servicioAgregado = !this.servicioAgregado;
    }
  }

  private cargarServicio(id: number): void {
    this.servicio = this.servicioService.obtenerPorId(id);
    this.serviciosRelacionados = this.servicio
      ? this.servicioService.obtenerRelacionados(id, 2)
      : [];
    this.servicioAgregado = false;
  }
}
