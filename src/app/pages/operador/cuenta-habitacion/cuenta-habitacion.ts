import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OperadorSidebar } from '../../../components/operador-sidebar/operador-sidebar';
import { ConsumoHabitacion } from '../../../models/consumo-habitacion.model';
import { ConsumoSolicitud } from '../../../models/consumo-solicitud.model';
import { CuentaHabitacionDetalles } from './components/cuenta-habitacion-detalles/cuenta-habitacion-detalles';
import { CuentaHabitacionServicios } from './components/cuenta-habitacion-servicios/cuenta-habitacion-servicios';
import { CuentaHabitacionTabla } from './components/cuenta-habitacion-tabla/cuenta-habitacion-tabla';
import { CuentaHabitacionResumen } from './components/cuenta-habitacion-resumen/cuenta-habitacion-resumen';

@Component({
  imports: [
    OperadorSidebar,
    RouterLink,
    CuentaHabitacionDetalles,
    CuentaHabitacionServicios,
    CuentaHabitacionTabla,
    CuentaHabitacionResumen,
  ],
  selector: 'app-operador-cuenta-habitacion',
  templateUrl: './cuenta-habitacion.html',
})
export class OperadorCuentaHabitacion implements OnInit {
  private route = inject(ActivatedRoute);

  habitacionId = '301';
  mensaje = '';

  readonly servicios = [
    { id: 1, nombre: 'Spa & Bienestar', precio: 120_000 },
    { id: 2, nombre: 'Restaurante Gourmet', precio: 85_000 },
    { id: 3, nombre: 'Minibar', precio: 45_000 },
  ];

  consumos: ConsumoHabitacion[] = [
    { servicioId: 1, nombre: 'Spa & Bienestar', precio: 120_000, cantidad: 1 },
    { servicioId: 2, nombre: 'Restaurante Gourmet', precio: 85_000, cantidad: 2 },
    { servicioId: 3, nombre: 'Minibar', precio: 45_000, cantidad: 3 },
  ];

  ngOnInit(): void {
    this.habitacionId = this.route.snapshot.paramMap.get('id') ?? '301';
  }

  agregarServicio(evento: ConsumoSolicitud): void {
    const servicio = this.servicios.find((item) => item.id === evento.servicioId);
    if (!servicio || !Number.isInteger(evento.cantidad) || evento.cantidad < 1) {
      this.mensaje = 'Selecciona un servicio e indica una cantidad válida.';
      return;
    }

    const consumo = this.consumos.find((item) => item.servicioId === servicio.id);
    if (consumo) {
      consumo.cantidad += evento.cantidad;
    } else {
      this.consumos = [
        ...this.consumos,
        { ...servicio, servicioId: servicio.id, cantidad: evento.cantidad },
      ];
    }

    this.mensaje = 'Consumo agregado a la vista de demostración.';
  }

  eliminarConsumo(consumo: ConsumoHabitacion): void {
    this.consumos = this.consumos.filter((item) => item !== consumo);
    this.mensaje = 'Consumo eliminado de la vista de demostración.';
  }
}
