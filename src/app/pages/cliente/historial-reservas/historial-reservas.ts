import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavbarCliente } from '../../../components/navbar-cliente/navbar-cliente';
import { Reserva } from '../../../models/reserva.model';
import { ReservaService } from '../../../services/reserva.service';
import { HistorialItem } from './components/historial-item/historial-item';
import { HistorialVacioBanner } from './components/historial-vacio-banner/historial-vacio-banner';

@Component({
  selector: 'app-historial-reservas',
  imports: [NavbarCliente, HistorialItem, HistorialVacioBanner],
  templateUrl: './historial-reservas.html',
  styleUrl: './historial-reservas.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class HistorialReservas implements OnInit {
  private route = inject(ActivatedRoute);
  private reservaService = inject(ReservaService);

  clienteId = 0;
  historial: Reserva[] = [];
  filtroActual = 'TODOS';

  ngOnInit(): void {
    this.clienteId = Number(this.route.snapshot.params['id']);
    this.reservaService.buscarHistorialPorCliente(this.clienteId).subscribe({
      next: (datos) => (this.historial = datos),
      error: (err) => console.error('Error al cargar historial:', err),
    });
  }

  get historialFiltrado(): Reserva[] {
    if (this.filtroActual === 'TODOS') {
      return this.historial;
    }
    return this.historial.filter((h) => h.estado?.toUpperCase() === this.filtroActual);
  }

  seleccionarFiltro(filtro: string): void {
    this.filtroActual = filtro;
  }

  get nochesTotales(): number {
    return this.historial.reduce((acc, curr) => {
      const ini = new Date(curr.fechaInicio).getTime();
      const fin = new Date(curr.fechaFin).getTime();
      const noches = Math.max(0, Math.round((fin - ini) / 86_400_000));
      return acc + (isNaN(noches) ? 0 : noches);
    }, 0);
  }

  get cancelaciones(): number {
    return this.historial.filter((h) => h.estado?.toUpperCase() === 'CANCELADA').length;
  }
}