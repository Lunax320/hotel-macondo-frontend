import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConsumoSolicitud } from '../../../../../models/consumo-solicitud.model';
import { ServicioCuenta } from '../../../../../models/servicio-cuenta.model';

@Component({
  imports: [CurrencyPipe, FormsModule],
  selector: 'app-cuenta-habitacion-servicios',
  templateUrl: './cuenta-habitacion-servicios.html',
})
export class CuentaHabitacionServicios {
  @Input({ required: true }) servicios: ServicioCuenta[] = [];
  @Input() mensaje = '';
  @Output() agregar = new EventEmitter<ConsumoSolicitud>();

  servicioSeleccionado: number | null = null;
  cantidad = 1;

  enviar(): void {
    this.agregar.emit({ servicioId: this.servicioSeleccionado, cantidad: this.cantidad });
    this.servicioSeleccionado = null;
    this.cantidad = 1;
  }
}
