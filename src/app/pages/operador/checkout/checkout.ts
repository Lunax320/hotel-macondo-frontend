import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { OperadorSidebar } from '../../../components/operador-sidebar/operador-sidebar';
import { AlertaMensaje } from '../../../components/alerta-mensaje/alerta-mensaje';
import { ReservaDetalleOperador } from '../../../models/reserva-detalle-operador.model';
import { ReservaService } from '../../../services/reserva.service';
import { ToastService } from '../../../services/toast.service';
import { EstadiaConSaldo, cargarDatosOperador, hoyISO } from '../inicio/estadias';
import { ReservaOperador } from '../../../models/reserva-operador.model';
import { CheckoutEstadia } from './components/checkout-estadia/checkout-estadia';
import { CheckoutConsumos } from './components/checkout-consumos/checkout-consumos';
import { CheckoutPago } from './components/checkout-pago/checkout-pago';
import { CheckoutVerificaciones } from './components/checkout-verificaciones/checkout-verificaciones';

@Component({
  imports: [
    OperadorSidebar,
    AlertaMensaje,
    RouterLink,
    FormsModule,
    CurrencyPipe,
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
  private router = inject(Router);
  private toast = inject(ToastService);

  consulta = '';
  cargandoLista = true;
  errorLista = '';
  enCurso: EstadiaConSaldo[] = [];
  confirmadas: ReservaOperador[] = [];
  reserva: ReservaDetalleOperador | null = null;
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

  // Una sola suscripción a la URL: cada búsqueda cambia ?id= y recarga la reserva.
  ngOnInit(): void {
    this.cargarLista();

    this.route.queryParamMap
      .pipe(
        map((p) => (p.get('id') ?? '').trim()),
        tap((id) => {
          this.consulta = id;
          this.reserva = null;
          this.mensajeError = '';
        }),
        switchMap((id) => (id ? this.resolver(id) : of(null))),
      )
      .subscribe((reserva) => (this.reserva = reserva));
  }

  // Carga las estadías en curso y las confirmadas. Si falla, no se muestra "nada por cobrar".
  cargarLista(): void {
    this.cargandoLista = true;
    this.errorLista = '';
    cargarDatosOperador(this.reservaServicio).subscribe({
      next: ({ reservas, enCurso }) => {
        this.enCurso = enCurso;
        const hoy = hoyISO();
        this.confirmadas = reservas.filter(
          (r) => r.estado === 'CONFIRMADA' && r.fechaInicio <= hoy && r.fechaFin >= hoy,
        );
        this.cargandoLista = false;
      },
      error: () => {
        this.errorLista = 'No fue posible cargar las estadías. Vuelve a consultar.';
        this.cargandoLista = false;
      },
    });
  }

  // Número de habitación -> reserva activa; cualquier otro texto -> número de reserva.
  private resolver(id: string): Observable<ReservaDetalleOperador | null> {
    const flujo = /^\d+$/.test(id)
      ? this.reservaServicio
          .obtenerReservaCheckoutPorHabitacion(id)
          .pipe(switchMap((r) => this.reservaServicio.obtenerDetalleOperadorPorId(r.idReserva)))
      : this.reservaServicio.obtenerDetalleOperador(id);
    return flujo.pipe(
      catchError((error) => {
        this.mensajeError = `No encontramos «${id}». ${error.error?.mensaje ?? 'Revisa el número e inténtalo de nuevo.'}`;
        return of(null);
      }),
    );
  }

  // Pone el valor en el campo y busca (si es el mismo, vuelve a cargar).
  buscar(valor: string): void {
    const id = valor.trim();
    if (!id) {
      return;
    }
    this.consulta = id;
    // "t" fuerza la recarga cuando se busca el mismo valor otra vez.
    const igual = id === this.route.snapshot.queryParamMap.get('id');
    this.router.navigate([], { queryParams: igual ? { id, t: Date.now() } : { id }, replaceUrl: true });
  }

  // Paga el total de la cuenta y recarga el detalle para ver el pago en el historial
  pagar(metodoPago: string): void {
    const numero = this.reserva?.numeroReserva;
    if (numero) {
      this.ejecutar(
        this.reservaServicio.pagarCuentaReserva(numero, metodoPago),
        numero,
        'Pago registrado.',
        'No fue posible completar la operación.',
      );
    }
  }

  // Finaliza la estadía (el backend exige la cuenta pagada)
  finalizar(): void {
    const numero = this.reserva?.numeroReserva;
    if (numero) {
      this.ejecutar(
        this.reservaServicio.finalizarReservaOperador(numero),
        numero,
        `Estadía de la habitación ${this.reserva?.habitacion?.numero} finalizada.`,
        'No fue posible finalizar la estadía.',
      );
    }
  }

  // Ejecuta la acción y luego recarga la reserva en un solo flujo
  private ejecutar(accion: Observable<unknown>, numero: string, exito: string, fallo: string): void {
    this.procesando = true;
    this.mensajeError = '';
    accion.pipe(switchMap(() => this.reservaServicio.obtenerDetalleOperador(numero))).subscribe({
      next: (reserva) => {
        this.reserva = reserva;
        this.toast.mostrar(exito);
        this.procesando = false;
      },
      error: (error) => {
        this.toast.mostrar(error.error?.mensaje ?? fallo, 'error');
        this.procesando = false;
      },
    });
  }
}
