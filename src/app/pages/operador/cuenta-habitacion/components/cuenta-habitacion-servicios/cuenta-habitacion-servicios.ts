import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface ServicioCuenta {
  id: number;
  nombre: string;
  precio: number;
}

@Component({
  imports: [CurrencyPipe, FormsModule],
  selector: 'app-cuenta-habitacion-servicios',
  templateUrl: './cuenta-habitacion-servicios.html',
})
export class CuentaHabitacionServicios {
  @Input({ required: true }) servicios: ServicioCuenta[] = [];
  @Input() mensaje = '';
  @Output() agregar = new EventEmitter<{ servicioId: number | null; cantidad: number }>();

  servicioSeleccionado: number | null = null;
  cantidad = 1;

  enviar(): void {
    this.agregar.emit({ servicioId: this.servicioSeleccionado, cantidad: this.cantidad });
    this.servicioSeleccionado = null;
    this.cantidad = 1;
  }
}
