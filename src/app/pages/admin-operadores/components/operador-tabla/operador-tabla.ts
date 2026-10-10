import { EstadoBadge } from '../../../../components/estado-badge/estado-badge';
import { Component, input, output } from '@angular/core';
import { Operador } from '../../../../models/operador.model';

// Tabla de operadores con acciones de cambiar estado y eliminar.
@Component({
  imports: [EstadoBadge],
  selector: 'app-operador-tabla',
  templateUrl: './operador-tabla.html',
  styleUrl: './operador-tabla.scss',
})
export class OperadorTabla {
  operadores = input<Operador[]>([]);
  cambiarEstado = output<number>();
  eliminar = output<number>();

  // Emite el evento de cambiar estado.
  onCambiarEstado(id: number | undefined): void {
    if (id !== undefined) {
      this.cambiarEstado.emit(id);
    }
  }

  // Emite el evento de eliminar.
  onEliminar(id: number | undefined): void {
    if (id !== undefined) {
      this.eliminar.emit(id);
    }
  }
}
