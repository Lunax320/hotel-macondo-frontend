import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { OperadorSidebar } from '../../../components/operador-sidebar/operador-sidebar';
import { ReservaDetalleOperador } from '../../../models/reserva-detalle-operador.model';
import { ReservaService } from '../../../services/reserva.service';
import { CheckoutEstadia } from './components/checkout-estadia/checkout-estadia';
import { CheckoutConsumos } from './components/checkout-consumos/checkout-consumos';
import { CheckoutPago } from './components/checkout-pago/checkout-pago';
import { CheckoutVerificaciones } from './components/checkout-verificaciones/checkout-verificaciones';

@Component({
  imports: [
    OperadorSidebar,
    RouterLink,
    CheckoutEstadia,
    CheckoutConsumos,
    CheckoutPago,
    CheckoutVerificaciones,
  ],
  selector: 'app-operador-checkout',
  templateUrl: './checkout.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class OperadorCheckout implements OnInit {
  private route = inject(ActivatedRoute);
  private reservaServicio = inject(ReservaService);

  habitacionId = '';
  reserva: ReservaDetalleOperador | null = null;
  mensaje = '';
  mensajeError = '';
  procesando = false;

  // La cuenta está saldada si ya se pagó o si los anticipos cubren el total (igual que el backend)
  get cuentaSaldada(): boolean {
    const cuenta = this.reserva?.cuenta;
    if (!cuenta || cuenta.estado === 'PAGADA') {
      return true;
    }
    const abonado = cuenta.pagos.reduce((suma, pago) => suma + pago.monto, 0);
    return cuenta.total - abonado <= 0;
  }

  // Busca la reserva activa de la habitación y luego carga su detalle con la cuenta
  ngOnInit(): void {
    this.habitacionId = this.route.snapshot.queryParamMap.get('id') ?? '';
    if (!/^\d+$/.test(this.habitacionId)) {
      this.mensajeError = 'Ingresa un número de habitación válido desde el panel.';
      return;
    }

    this.reservaServicio
      .obtenerReservaCheckoutPorHabitacion(this.habitacionId)
      .pipe(switchMap((r) => this.reservaServicio.obtenerDetalleOperadorPorId(r.idReserva)))
      .subscribe({
        next: (reserva) => (this.reserva = reserva),
        error: (error) =>
          (this.mensajeError =
            error.error?.mensaje ?? 'No fue posible cargar la reserva de la habitación.'),
      });
  }

  // Paga el total de la cuenta y recarga el detalle para ver el pago en el historial
  pagar(metodoPago: string): void {
    const numero = this.reserva?.numeroReserva;
    if (numero) {
      this.ejecutar(this.reservaServicio.pagarCuentaReserva(numero, metodoPago), numero, 'Pago registrado.');
    }
  }

  // Finaliza la estadía (el backend exige la cuenta pagada)
  finalizar(): void {
    const numero = this.reserva?.numeroReserva;
    if (numero) {
      this.ejecutar(this.reservaServicio.finalizarReservaOperador(numero), numero, 'Estadía finalizada.');
    }
  }

  // Ejecuta la acción y luego recarga la reserva en un solo flujo
  private ejecutar(accion: Observable<unknown>, numero: string, exito: string): void {
    this.procesando = true;
    this.mensaje = '';
    this.mensajeError = '';
    accion.pipe(switchMap(() => this.reservaServicio.obtenerDetalleOperador(numero))).subscribe({
      next: (reserva) => {
        this.reserva = reserva;
        this.mensaje = exito;
        this.procesando = false;
      },
      error: (error) => {
        this.mensajeError = error.error?.mensaje ?? 'No fue posible completar la operación.';
        this.procesando = false;
      },
    });
  }
}
