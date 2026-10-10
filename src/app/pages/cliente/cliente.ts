import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { NavbarCliente } from '../../components/navbar-cliente/navbar-cliente';
import { Cliente } from '../../models/cliente.model';
import { Habitacion } from '../../models/habitacion.model';
import { Reserva } from '../../models/reserva.model';
import { Servicio } from '../../models/servicio.model';
import { ClienteService } from '../../services/cliente.service';
import { HabitacionService } from '../../services/habitacion.service';
import { ReservaService } from '../../services/reserva.service';
import { ServicioService } from '../../services/servicio.service';
import { ClienteSaludo } from './components/cliente-saludo/cliente-saludo';
import { ReservaActivaCard } from './components/reserva-activa-card/reserva-activa-card';
import { ReservaActivaVacia } from './components/reserva-activa-vacia/reserva-activa-vacia';
import { AccesoRapido } from './components/acceso-rapido/acceso-rapido';
import { ServiciosRecomendados } from './components/servicios-recomendados/servicios-recomendados';

// Panel principal con el resumen de la estancia y recomendaciones del cliente.
@Component({
  selector: 'app-portal-cliente',
  imports: [
    NavbarCliente,
    ClienteSaludo,
    ReservaActivaCard,
    ReservaActivaVacia,
    AccesoRapido,
    ServiciosRecomendados,
  ],
  templateUrl: './cliente.html',
  styleUrl: './cliente.scss',
  // Angular 22 usa OnPush por defecto; Eager hace que la vista se actualice al llegar los datos HTTP.
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class PortalCliente implements OnInit {
  private route = inject(ActivatedRoute);
  private clienteService = inject(ClienteService);
  private reservaService = inject(ReservaService);
  private habitacionService = inject(HabitacionService);
  private servicioService = inject(ServicioService);
  clienteId = 0;
  cliente?: Cliente;
  reservaActiva?: Reserva;
  habitacionActiva?: Habitacion | null;
  cantidadActivas = 0;
  cantidadHistorial = 0;
  recomendaciones: Servicio[] = [];
  mensajeError = '';
  // Fecha larga en español con la primera letra en mayúscula, igual que en Thymeleaf
  fechaActual = this.capitalizar(
    new Intl.DateTimeFormat('es-CO', { dateStyle: 'full' }).format(new Date()),
  );

  // Carga el resumen encadenado y los datos secundarios del portal.
  ngOnInit(): void {
    this.clienteId = Number(this.route.snapshot.params['id']);
    if (!Number.isInteger(this.clienteId) || this.clienteId < 1) {
      this.mensajeError = 'No encontramos tu cuenta.';
      return;
    }
    this.clienteService
      .buscarPorId(this.clienteId)
      .pipe(
        switchMap((cliente) => {
          this.cliente = cliente;
          return this.reservaService.buscarActivasPorCliente(this.clienteId);
        }),
        switchMap((activas) => {
          this.cantidadActivas = activas.length;
          this.reservaActiva = activas[0];
          return activas.length && activas[0].id
            ? this.habitacionService.buscarPorReserva(activas[0].id)
            : of(null);
        }),
      )
      .subscribe({
        next: (habitacion) => (this.habitacionActiva = habitacion),
        error: () => (this.mensajeError = 'No encontramos tu cuenta.'),
      });
    this.reservaService
      .buscarHistorialPorCliente(this.clienteId)
      .subscribe({ next: (historial) => (this.cantidadHistorial = historial.length) });
    this.servicioService
      .buscarRecomendaciones()
      .subscribe({ next: (servicios) => (this.recomendaciones = servicios) });
  }

  // Calcula las noches entre las fechas de inicio y fin de la reserva.
  nochesReserva(reserva: Reserva): number {
    return Math.max(
      0,
      Math.round(
        (new Date(`${reserva.fechaFin}T00:00:00`).getTime() -
          new Date(`${reserva.fechaInicio}T00:00:00`).getTime()) /
          86_400_000,
      ),
    );
  }

  // Pone en mayúscula la primera letra de un texto.
  private capitalizar(texto: string): string {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }
}
