import { Component, input } from '@angular/core';
import { Cliente } from '../../../../../models/cliente.model';

@Component({
  selector: 'app-detalle-reserva-cliente',
  templateUrl: './detalle-reserva-cliente.html',
})
export class DetalleReservaCliente {
  cliente = input<Cliente | undefined>();
}
