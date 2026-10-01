import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
import { TipoHabitacion } from '../../models/tipo-habitacion.model';
import { HabitacionService } from '../../services/habitacion.service';
import { TipoHabitacionService } from '../../services/tipo-habitacion.service';
import { ResumenReservaHabitacion } from './components/resumen-reserva-habitacion/resumen-reserva-habitacion';

@Component({
  imports: [RouterLink, ResumenReservaHabitacion],
  selector: 'app-detalle-habitacion',
  styleUrl: './detalle-habitacion.scss',
  templateUrl: './detalle-habitacion.html',
})
export class DetalleHabitacion implements OnInit {
  private route = inject(ActivatedRoute);
  private habitacionService = inject(HabitacionService);
  private tipoHabitacionService = inject(TipoHabitacionService);

  tipoHabitacion?: TipoHabitacion;
  hayDisponibilidad = false;
  clienteId: number | null = null;

  ngOnInit(): void {
    this.route.paramMap.subscribe((parametros) => {
      const id = Number(parametros.get('id'));
      this.cargarTipoHabitacion(id);
    });

    this.route.queryParamMap.subscribe((parametros) => {
      this.clienteId = this.obtenerClienteId(parametros);
    });
  }

  private cargarTipoHabitacion(id: number): void {
    this.tipoHabitacion = this.tipoHabitacionService.obtenerPorId(id);
    this.hayDisponibilidad = false;

    if (this.tipoHabitacion) {
      this.hayDisponibilidad = this.habitacionService.hayDisponibilidadPorTipo(this.tipoHabitacion);
    }
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
