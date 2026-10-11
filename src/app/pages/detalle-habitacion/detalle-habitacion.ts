import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { TipoHabitacion } from '../../models/tipo-habitacion.model';
import { HabitacionService } from '../../services/habitacion.service';
import { TipoHabitacionService } from '../../services/tipo-habitacion.service';
import { ResumenReservaHabitacion } from './components/resumen-reserva-habitacion/resumen-reserva-habitacion';

@Component({
  imports: [RouterLink, ResumenReservaHabitacion],
  selector: 'app-detalle-habitacion',
  styleUrl: './detalle-habitacion.scss',
  templateUrl: './detalle-habitacion.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class DetalleHabitacion implements OnInit {
  private route = inject(ActivatedRoute);
  private habitacionService = inject(HabitacionService);
  private tipoHabitacionService = inject(TipoHabitacionService);

  tipoHabitacion?: TipoHabitacion;
  hayDisponibilidad = false;
  clienteId: number | null = null;

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((parametros) => {
          const id = Number(parametros.get('id'));
          return this.tipoHabitacionService.obtenerPorId(id);
        })
      )
      .subscribe({
        next: (tipo) => {
          this.tipoHabitacion = tipo;
          this.hayDisponibilidad = tipo ? this.habitacionService.hayDisponibilidadPorTipo(tipo) : false;
        },
        error: (err) => console.error('Error al cargar detalle de habitacion:', err),
      });

    this.route.queryParamMap.subscribe((parametros) => {
      this.clienteId = this.obtenerClienteId(parametros);
    });
  }

  private obtenerClienteId(parametros: ParamMap): number | null {
    const valor = parametros.get('clienteId');

    if (valor === null || valor.trim() === '') {
      return null;
    }

    const numero = Number(valor);
    return Number.isFinite(numero) ? numero : null;
  }
}