import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

// Acceso rápido con cuatro tarjetas de navegación y sus conteos.
@Component({
  imports: [RouterLink],
  selector: 'app-acceso-rapido',
  templateUrl: './acceso-rapido.html',
  styleUrl: './acceso-rapido.scss',
})
export class AccesoRapido {
  clienteId = input<number>();
  cantidadActivas = input<number>(0);
  cantidadHistorial = input<number>(0);

  // Ruta a reservas activas.
  rutaReservas(): string[] {
    return ['/cliente', String(this.clienteId()), 'reservas'];
  }

  // Ruta al historial.
  rutaHistorial(): string[] {
    return ['/cliente', String(this.clienteId()), 'historial'];
  }

  // Ruta al perfil.
  rutaPerfil(): string[] {
    return ['/cliente', String(this.clienteId()), 'perfil'];
  }

  // Ruta a nueva reserva.
  rutaNuevaReserva(): string[] {
    return ['/cliente', String(this.clienteId()), 'reservas', 'nueva'];
  }
}
