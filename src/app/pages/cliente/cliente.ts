import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { Cliente } from '../../models/cliente.model';
import { Reserva } from '../../models/reserva.model';
import { ClienteService } from '../../services/cliente.service';
import { ReservaService } from '../../services/reserva.service';
import { AlertaMensaje } from '../../components/alerta-mensaje/alerta-mensaje';
import { ConfirmacionAccion } from '../../components/confirmacion-accion/confirmacion-accion';
import { ClienteEncabezado } from './components/cliente-encabezado/cliente-encabezado';
import { ClienteDatosForm } from './components/cliente-datos-form/cliente-datos-form';
import { ReservasActivas } from './components/reservas-activas/reservas-activas';
import { ReservasHistorial } from './components/reservas-historial/reservas-historial';
// Portal del cliente: ver y editar datos, consultar y cancelar reservas.
@Component({
  imports: [
    AlertaMensaje,
    ConfirmacionAccion,
    ClienteEncabezado,
    ClienteDatosForm,
    ReservasActivas,
    ReservasHistorial,
  ],
  selector: 'app-portal-cliente',
  styleUrl: './cliente.scss',
  templateUrl: './cliente.html',
})
export class PortalCliente implements OnInit {
  private route = inject(ActivatedRoute);
  private clienteService = inject(ClienteService);
  private reservaService = inject(ReservaService);
  clienteId = 0;
  cliente?: Cliente;
  clienteEncontrado = true;
  mensajeExito = '';
  reservasActivas: Reserva[] = [];
  reservasPasadas: Reserva[] = [];
  reservaPendienteCancelar?: Reserva;
  ngOnInit(): void {
    this.clienteId = Number(this.route.snapshot.params['id']);
    if (!Number.isInteger(this.clienteId) || this.clienteId < 1) {
      this.clienteEncontrado = false;
      return;
    }
    this.clienteService
      .buscarPorId(this.clienteId)
      .pipe(
        switchMap((cliente) => {
          if (!cliente) {
            this.clienteEncontrado = false;
            return of([]);
          }
          this.cliente = cliente;
          return this.reservaService.buscarPorCliente(this.clienteId);
        }),
      )
      .subscribe((reservas) => this.separarReservas(reservas));
  }
  guardarCambios(clienteActualizado: Cliente): void {
    this.mensajeExito = '';
    if (!this.cliente) return;
    this.clienteService
      .actualizarCliente(this.clienteId, clienteActualizado)
      .subscribe((cliente) => {
        this.cliente = cliente;
        this.mensajeExito = 'Datos actualizados.';
      });
  }
  solicitarCancelacion(reserva: Reserva): void {
    this.reservaPendienteCancelar = reserva;
  }
  confirmarCancelacion(): void {
    const reservaId = this.reservaPendienteCancelar?.id;
    if (reservaId === undefined) return;
    this.reservaService
      .cancelarReserva(reservaId)
      .pipe(switchMap(() => this.reservaService.buscarPorCliente(this.clienteId)))
      .subscribe((reservas) => {
        this.separarReservas(reservas);
        this.reservaPendienteCancelar = undefined;
      });
  }
  volver(): void {
    this.reservaPendienteCancelar = undefined;
  }
  private separarReservas(reservas: Reserva[]): void {
    const esActiva = (reserva: Reserva) =>
      reserva.estado === 'ACTIVA' || reserva.estado === 'CONFIRMADA';
    this.reservasActivas = reservas.filter(esActiva);
    this.reservasPasadas = reservas.filter((reserva) => !esActiva(reserva));
  }
}
