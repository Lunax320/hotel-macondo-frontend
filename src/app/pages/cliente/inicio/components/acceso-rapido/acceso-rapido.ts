import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

// Acceso rápido con cuatro tarjetas de navegación y un dato útil en cada una.
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
  proximas = input<number>(0);
  noches = input<number>(0);

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

  // Plural simple: "1 noche" / "3 noches".
  private plural(n: number, uno: string, varios: string): string {
    return `${n} ${n === 1 ? uno : varios}`;
  }

  // Datos de las cuatro tarjetas.
  tarjetas() {
    return [
      {
        ruta: this.rutaReservas(),
        icono: 'bi-calendar-week',
        color: 'bg-[var(--azul)] text-white',
        nombre: 'Reservas Activas',
        descripcion: 'Ver reservas en curso',
        dato: `${this.plural(this.proximas(), 'próxima', 'próximas')} · ${this.plural(this.noches(), 'noche', 'noches')}`,
      },
      {
        ruta: this.rutaHistorial(),
        icono: 'bi-calendar3',
        color: 'bg-[#65443a] text-white',
        nombre: 'Historial',
        descripcion: 'Experiencias pasadas',
        dato: this.plural(this.cantidadHistorial(), 'estadía', 'estadías'),
      },
      {
        ruta: this.rutaPerfil(),
        icono: 'bi-person',
        color: 'bg-[#1fb56b] text-white',
        nombre: 'Mi Perfil',
        descripcion: 'Datos personales',
        dato: 'Edita tus datos',
      },
      {
        ruta: this.rutaNuevaReserva(),
        icono: 'bi-plus-lg',
        color: 'bg-[var(--dorado)] text-[var(--azul-oscuro)]',
        nombre: 'Nueva Reserva',
        descripcion: 'Reservar habitación',
        dato: 'Elige fechas y tipo',
      },
    ];
  }
}
