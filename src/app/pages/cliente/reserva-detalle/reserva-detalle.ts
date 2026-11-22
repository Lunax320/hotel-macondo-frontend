import { CurrencyPipe, DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NavbarCliente } from '../../../components/navbar-cliente/navbar-cliente';
import { ReservaDetalleCliente } from '../../../models/reserva-detalle-cliente.model';
import { ReservaService } from '../../../services/reserva.service';

@Component({
  selector: 'app-reserva-detalle-cliente',
  imports: [NavbarCliente, CurrencyPipe, DatePipe, RouterLink, FormsModule],
  templateUrl: './reserva-detalle.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class ReservaDetalleClientePage implements OnInit {
  private route = inject(ActivatedRoute);
  private reservaService = inject(ReservaService);

  clienteId = 0;
  reservaId = 0;
  reserva: ReservaDetalleCliente | null = null;
  cargando = false;
  pagando = false;
  error = '';
  mensaje = '';
  montoPago = 0;

  ngOnInit(): void {
    this.clienteId = Number(this.route.snapshot.params['id']);
    this.reservaId = Number(this.route.snapshot.params['reservaId']);
    if (this.route.snapshot.queryParamMap.get('pago') === 'wompi') {
      this.mensaje = 'Regresaste de Wompi. El pago se reflejará cuando el backend reciba la confirmación.';
    }
    this.cargarDetalle();
  }

  cargarDetalle(): void {
    this.cargando = true;
    this.error = '';
    this.reservaService.obtenerDetalleCliente(this.clienteId, this.reservaId).subscribe({
      next: (detalle) => {
        this.reserva = detalle;
        this.montoPago = detalle.cuenta?.saldo ?? 0;
        this.cargando = false;
      },
      error: (error: HttpErrorResponse) => {
        this.error = this.mensajeError(error);
        this.cargando = false;
      },
    });
  }

  pagar(): void {
    const saldo = this.reserva?.cuenta?.saldo ?? 0;
    if (this.pagando || this.reserva?.estado.toUpperCase() !== 'ACTIVA' ||
        this.montoPago <= 0 || this.montoPago > saldo) return;
    this.pagando = true;
    this.error = '';
    this.mensaje = '';
    this.reservaService.pagarCuentaCliente(
      this.clienteId, this.reservaId, this.montoPago, 'WOMPI',
    ).subscribe({
      next: (checkout) => {
        window.location.assign(checkout.checkoutUrl);
      },
      error: (error: HttpErrorResponse) => {
        this.error = this.mensajeError(error);
        this.pagando = false;
      },
    });
  }

  private mensajeError(error: HttpErrorResponse): string {
    const body: unknown = error.error;
    if (body !== null && typeof body === 'object' && 'mensaje' in body &&
        typeof body.mensaje === 'string') return body.mensaje;
    return error.status === 0
      ? 'No fue posible conectar con el backend.'
      : 'No fue posible cargar o actualizar la cuenta.';
  }
}
