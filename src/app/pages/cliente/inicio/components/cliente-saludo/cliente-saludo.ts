import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

// Saludo cálido del cliente con resumen de su reserva activa y enlace al perfil.
@Component({
  imports: [RouterLink],
  selector: 'app-cliente-saludo',
  templateUrl: './cliente-saludo.html',
  styleUrl: './cliente-saludo.scss',
})
export class ClienteSaludo {
  nombre = input<string>();
  apellido = input<string>();
  fechaActual = input<string>();
  clienteId = input<number>();
  cargando = input(true);
  cantidadActivas = input(0);
  tipo = input<string>();
  numeroHabitacion = input<string | number>();
  rango = input('');

  // Enlace al perfil del cliente.
  rutaPerfil(): string[] {
    return ['/cliente', String(this.clienteId()), 'perfil'];
  }

  // Enlace a las reservas del cliente.
  rutaReservas(): string[] {
    return ['/cliente', String(this.clienteId()), 'reservas'];
  }

  // Enlace para crear una reserva.
  rutaNueva(): string[] {
    return ['/cliente', String(this.clienteId()), 'reservas', 'nueva'];
  }
}
