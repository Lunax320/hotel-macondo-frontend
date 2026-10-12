import { Component, input } from '@angular/core';

@Component({
  selector: 'app-detalle-reserva-habitacion',
  templateUrl: './detalle-reserva-habitacion.html',
})
export class DetalleReservaHabitacion {
  habitacion = input<{
    numero: string;
    nombre: string;
    piso?: number | null;
    capacidad: number;
    tipoHabitacion?: { nombre: string } | null;
  } | null>();
}
