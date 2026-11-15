import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServicioService } from '../../../../../services/servicio.service';
import { Servicio } from '../../../../../models/servicio.model';
import { ConsumoHabitacion } from '../../../../../models/consumo-habitacion.model';

@Component({
  imports: [CurrencyPipe, FormsModule],
  selector: 'app-cuenta-habitacion-servicios',
  templateUrl: './cuenta-habitacion-servicios.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class CuentaHabitacionServicios implements OnInit {
  @Output() serviciosAgregados = new EventEmitter<ConsumoHabitacion>();
  private servicioService = inject(ServicioService);

  servicios = signal<Servicio[]>([]);
  servicioSeleccionado: number | null = null;
  cantidad: number = 1;

  mensajeError: string = '';

  // Carga el catálogo de servicios activos al iniciar el componente
  ngOnInit(): void {
    this.servicioService.obtenerCatalogoActivo().subscribe({
      next: (servicios) => {
        this.servicios.set(servicios);
      },
      error: (error) => {
        this.mensajeError = 'No fue posible cargar los servicios.';
        console.error('Error al cargar servicios:', error);
      },
    });
  }

  // Valida el servicio elegido y emite el consumo hacia el componente padre
  enviar(): void {
    const servicio = this.servicios().find((s) => s.id === this.servicioSeleccionado);

    if (!servicio || servicio.id == null || !Number.isInteger(this.cantidad) || this.cantidad < 1) {
      this.mensajeError = 'Selecciona un servicio e indica una cantidad válida.';
      return;
    }

    // Emite el precio y la cantidad para ademas de mostrarlos calcular el subtotal
    this.serviciosAgregados.emit({
      servicioId: servicio.id,
      nombre: servicio.nombre,
      precio: servicio.precio,
      cantidad: this.cantidad,
    });

    this.servicioSeleccionado = null;
    this.cantidad = 1;
    this.mensajeError = '';
  }
}
