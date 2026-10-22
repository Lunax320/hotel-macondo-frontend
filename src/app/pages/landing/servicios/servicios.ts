import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Servicio } from '../../../models/servicio.model';
import { ServicioService } from '../../../services/servicio.service';
import { ServicioCard } from './components/servicio-card/servicio-card';

@Component({
  imports: [RouterLink, ServicioCard],
  selector: 'app-servicios',
  styleUrl: './servicios.scss',
  templateUrl: './servicios.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class Servicios implements OnInit {
  private servicioService = inject(ServicioService);

  servicios: Servicio[] = [];
  categorias: string[] = [];
  categoriaSeleccionada = 'Todos';
  serviciosAgregados: number[] = [];

  ngOnInit(): void {
    this.servicioService.obtenerCatalogoActivo().subscribe({
      next: (datos) => {
        this.servicios = datos;
        this.categorias = [...new Set(datos.map((s) => s.categoria))];
      },
      error: (err) => console.error('Error al cargar servicios:', err),
    });
  }

  get serviciosFiltrados(): Servicio[] {
    if (this.categoriaSeleccionada === 'Todos') {
      return this.servicios;
    }

    return this.servicios.filter((servicio) => servicio.categoria === this.categoriaSeleccionada);
  }

  seleccionarCategoria(categoria: string): void {
    this.categoriaSeleccionada = categoria;
  }

  estaAgregado(id: number | undefined): boolean {
    return id !== undefined && this.serviciosAgregados.includes(id);
  }

  alternarServicio(id: number): void {
    this.serviciosAgregados = this.serviciosAgregados.includes(id)
      ? this.serviciosAgregados.filter((servicioId) => servicioId !== id)
      : [...this.serviciosAgregados, id];
  }
}