import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
import { TipoHabitacion } from '../../models/tipo-habitacion.model';
import { TipoHabitacionService } from '../../services/tipo-habitacion.service';
import { HabitacionCard } from './components/habitacion-card/habitacion-card';

@Component({
  imports: [RouterLink, HabitacionCard],
  selector: 'app-habitaciones',
  styleUrl: './habitaciones.scss',
  templateUrl: './habitaciones.html',
})
export class Habitaciones implements OnInit {
  private route = inject(ActivatedRoute);
  private tipoHabitacionService = inject(TipoHabitacionService);

  tiposHabitacion: TipoHabitacion[] = [];
  personas: number | null = null;
  tipoId: number | null = null;
  clienteId: number | null = null;

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((parametros) => {
      this.personas = this.obtenerNumeroConsulta(parametros, 'personas');
      this.tipoId = this.obtenerNumeroConsulta(parametros, 'tipoId');
      this.clienteId = this.obtenerNumeroConsulta(parametros, 'clienteId');
      this.cargarTiposHabitacion();
    });
  }

  private cargarTiposHabitacion(): void {
    if (this.tipoId !== null) {
      const tipoHabitacion = this.tipoHabitacionService.obtenerPorId(this.tipoId);
      this.tiposHabitacion =
        tipoHabitacion !== undefined &&
        (this.personas === null || tipoHabitacion.capacidadPersonas >= this.personas)
          ? [tipoHabitacion]
          : [];
      return;
    }

    this.tiposHabitacion =
      this.personas === null
        ? this.tipoHabitacionService.obtenerTodos()
        : this.tipoHabitacionService.obtenerPorPersonas(this.personas);
  }

  private obtenerNumeroConsulta(parametros: ParamMap, nombre: string): number | null {
    const valor = parametros.get(nombre);

    if (valor === null || valor.trim() === '') {
      return null;
    }

    const numero = Number(valor);
    return Number.isFinite(numero) ? numero : null;
  }
}
