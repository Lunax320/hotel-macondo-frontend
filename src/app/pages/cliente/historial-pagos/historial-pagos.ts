import { CurrencyPipe, DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavbarCliente } from '../../../components/navbar-cliente/navbar-cliente';
import { PagoCliente } from '../../../models/pago-cliente.model';
import { ReservaService } from '../../../services/reserva.service';

@Component({
  selector: 'app-historial-pagos',
  imports: [NavbarCliente, CurrencyPipe, DatePipe],
  templateUrl: './historial-pagos.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class HistorialPagos implements OnInit {
  private route = inject(ActivatedRoute);
  private reservaService = inject(ReservaService);

  clienteId = 0;
  pagos: PagoCliente[] = [];
  cargando = false;
  errorCarga = '';

  // Lee el cliente de la ruta y carga su historial de pagos
  ngOnInit(): void {
    this.clienteId = Number(this.route.snapshot.params['id']);
    this.cargarPagos();
  }

  // Consulta el historial de pagos del cliente
  cargarPagos(): void {
    this.errorCarga = '';
    if (!Number.isInteger(this.clienteId) || this.clienteId < 1) {
      this.errorCarga = 'El identificador del cliente no es válido.';
      return;
    }
    this.cargando = true;
    this.reservaService.buscarPagosPorCliente(this.clienteId).subscribe({
      next: (datos) => {
        this.pagos = datos;
        this.cargando = false;
      },
      error: (error: HttpErrorResponse) => {
        const respuesta: unknown = error.error;
        this.errorCarga =
          respuesta !== null &&
          typeof respuesta === 'object' &&
          'mensaje' in respuesta &&
          typeof respuesta.mensaje === 'string'
            ? respuesta.mensaje
            : 'No fue posible cargar el historial de pagos. Verifica la conexión con el backend.';
        this.cargando = false;
      },
    });
  }
}
