import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
  selector: 'app-checkout-verificaciones',
  templateUrl: './checkout-verificaciones.html',
})
export class CheckoutVerificaciones {
  @Input() cuentaPagada = false;
  @Input() reservaActiva = false;
  @Input() procesando = false;
  @Output() finalizar = new EventEmitter<void>();

  llavesDevueltas = false;
  habitacionInspeccionada = false;
  // Finalizar la estadía es irreversible: pide un segundo clic de confirmación
  confirmando = false;

  // Lista de lo que impide finalizar (vacía si todo está listo)
  get faltantes(): string[] {
    const lista: string[] = [];
    if (!this.cuentaPagada) lista.push('cuenta saldada');
    if (!this.llavesDevueltas) lista.push('llaves devueltas');
    if (!this.habitacionInspeccionada) lista.push('habitación inspeccionada');
    return lista;
  }

  // Emitir finalización si se cumplen las verificaciones
  onFinalizar(): void {
    if (!this.cuentaPagada || !this.llavesDevueltas || !this.habitacionInspeccionada || !this.reservaActiva || this.procesando) {
      return;
    }
    this.confirmando = false;
    this.finalizar.emit();
  }
}
