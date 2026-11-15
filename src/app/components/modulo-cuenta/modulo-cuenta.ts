import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReservaService } from '../../services/reserva.service';

@Component({
  imports: [FormsModule],
  selector: 'app-modulo-cuenta',
  templateUrl: './modulo-cuenta.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class ModuloCuenta {
  private router = inject(Router);
  private serviceReserva = inject(ReservaService);

  habitacionId = '';
  mensajeError = '';

  // Busca la reserva activa de la habitación y navega a su cuenta
  buscarCuenta(): void {
    const numeroHabitacion = this.habitacionId.trim();

    if (!/^\d+$/.test(numeroHabitacion)) {
      this.mensajeError = 'Ingresa un número de habitación válido.';
      return;
    }

    this.mensajeError = '';
    this.serviceReserva.obtenerReservaActualPorHabitacion(numeroHabitacion).subscribe({
      next: (reserva) => {
        this.mensajeError = '';
        this.router.navigate(['/operador/cuenta', reserva.idReserva]);
      },
      error: (error) => {
        this.mensajeError =
          error.error?.mensaje ??
          'No se encontró una reserva activa con cuenta abierta para esa habitación.';
      },
    });
  }
}
