import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavbarCliente } from '../../components/navbar-cliente/navbar-cliente';
import { Reserva } from '../../models/reserva.model';
import { ReservaService } from '../../services/reserva.service';
import { ReservasFiltroBarra } from './components/reservas-filtro-barra/reservas-filtro-barra';
import { ReservasActivaItem } from './components/reservas-activa-item/reservas-activa-item';
import { ReservasMetricasResumen } from './components/reservas-metricas-resumen/reservas-metricas-resumen';

@Component({
  selector: 'app-reservas-activas',
  imports: [
    NavbarCliente,
    ReservasFiltroBarra,
    ReservasActivaItem,
    ReservasMetricasResumen,
  ],
  templateUrl: './reservas-activas.html',
  styleUrl: './reservas-activas.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class ReservasActivas implements OnInit {
  private route = inject(ActivatedRoute);
  private reservaService = inject(ReservaService);

  clienteId = 0;
  reservas: Reserva[] = [];
  filtroActual = 'TODOS';

  ngOnInit(): void {
    this.clienteId = Number(this.route.snapshot.params['id']);
    this.cargarReservas();
  }

  cargarReservas(): void {
    this.reservaService.buscarActivasPorCliente(this.clienteId).subscribe({
      next: (datos) => (this.reservas = datos),
      error: (err) => console.error('Error al cargar reservas activas:', err),
    });
  }

  get reservasFiltradas(): Reserva[] {
    if (this.filtroActual === 'TODOS') {
      return this.reservas;
    }
    return this.reservas.filter((r) => r.estado?.toUpperCase() === this.filtroActual);
  }

  actualizarFiltro(estado: string): void {
    this.filtroActual = estado;
  }

  cancelarReserva(reservaId: number): void {
    // Se cancela localmente reflejando la respuesta
    this.reservas = this.reservas.filter((r) => r.id !== reservaId);
  }

  contarPorEstado(estado: string): number {
    return this.reservas.filter((r) => r.estado?.toUpperCase() === estado).length;
  }
}