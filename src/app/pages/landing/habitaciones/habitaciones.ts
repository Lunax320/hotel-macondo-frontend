import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
import { TipoHabitacion } from '../../../models/tipo-habitacion.model';
import { TipoHabitacionService } from '../../../services/tipo-habitacion.service';
import { ToastService } from '../../../services/toast.service';
import { HabitacionCard } from './components/habitacion-card/habitacion-card';
import { SimuladorEstadia } from './components/simulador-estadia/simulador-estadia';

@Component({
  imports: [RouterLink, HabitacionCard, SimuladorEstadia],
  selector: 'app-habitaciones',
  styleUrl: './habitaciones.scss',
  templateUrl: './habitaciones.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class Habitaciones implements OnInit {
  private route = inject(ActivatedRoute);
  private tipoHabitacionService = inject(TipoHabitacionService);
  private toast = inject(ToastService);

  tiposHabitacion: TipoHabitacion[] = [];
  personas: number | null = null;
  tipoId: number | null = null;
  clienteId: number | null = null;

  // Observa los parámetros de consulta para aplicar filtros de capacidad y tipo.
  ngOnInit(): void {
    this.route.queryParamMap.subscribe((parametros) => {
      this.personas = this.obtenerNumeroConsulta(parametros, 'personas');
      this.tipoId = this.obtenerNumeroConsulta(parametros, 'tipoId');
      this.clienteId = this.obtenerNumeroConsulta(parametros, 'clienteId');
      this.cargarTiposHabitacion();
    });
  }

  // Carga los tipos y filtra por identificador y capacidad según la consulta.
  private cargarTiposHabitacion(): void {
    this.tipoHabitacionService.obtenerTodos().subscribe({
      next: (todosLosTipos) => {
        if (this.tipoId !== null) {
          const tipoHabitacion = todosLosTipos.find((t) => t.id === this.tipoId);
          this.tiposHabitacion =
            tipoHabitacion !== undefined &&
            (this.personas === null || tipoHabitacion.capacidadPersonas >= this.personas)
              ? [tipoHabitacion]
              : [];
          return;
        }

        this.tiposHabitacion =
          this.personas === null
            ? todosLosTipos
            : todosLosTipos.filter((t) => t.capacidadPersonas >= (this.personas ?? 0));
      },
      error: () => this.toast.mostrar('No fue posible cargar las habitaciones. Intenta más tarde.', 'error'),
    });
  }

  // Convierte un parámetro de consulta a número o devuelve null si no es válido.
  private obtenerNumeroConsulta(parametros: ParamMap, nombre: string): number | null {
    const valor = parametros.get(nombre);

    if (valor === null || valor.trim() === '') {
      return null;
    }

    const numero = Number(valor);
    return Number.isFinite(numero) ? numero : null;
  }
}