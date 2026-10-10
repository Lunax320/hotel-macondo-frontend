import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Habitacion } from '../../../../models/habitacion.model';

// Botones de una fila de habitaciones: ver, editar, habilitar/deshabilitar y eliminar.
@Component({
  imports: [RouterLink],
  selector: 'app-habitacion-acciones',
  styleUrl: './habitacion-acciones.scss',
  templateUrl: './habitacion-acciones.html',
})
export class HabitacionAcciones {
  habitacion = input.required<Habitacion>();
  // Le avisan a la tabla (y esta a la pagina) que accion pidio el usuario.
  cambioEstadoSolicitado = output<Habitacion>();
  eliminacionSolicitada = output<Habitacion>();
}
