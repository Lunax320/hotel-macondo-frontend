import { EstadoBadge } from '../../../../../components/estado-badge/estado-badge';
import { Component, input, output } from '@angular/core';
import { Operador } from '../../../../../models/operador.model';

// Tabla de operadores con acciones de cambiar estado y eliminar.
@Component({
  imports: [EstadoBadge],
  selector: 'app-operador-tabla',
  templateUrl: './operador-tabla.html',
  styleUrl: './operador-tabla.scss',
})
export class OperadorTabla {
  operadores = input<Operador[]>([]);
  // true si la carga falló: no mostrar "lista vacía" porque sería engañoso
  cargaFallida = input(false);
  cambiarEstado = output<number>();
  eliminar = output<number>();
  // Id del operador cuyo borrado espera confirmación (eliminar es irreversible)
  pendienteEliminar: number | null = null;

  // Emite el evento de cambiar estado.
  onCambiarEstado(id: number | undefined): void {
    if (id !== undefined) {
      this.cambiarEstado.emit(id);
    }
  }

  // Nombre del operador pendiente de eliminar, para el mensaje de confirmación.
  nombrePendiente(): string {
    return this.operadores().find((o) => o.id === this.pendienteEliminar)?.nombre ?? 'este operador';
  }

  // Emite el evento de eliminar.
  onEliminar(id: number | undefined): void {
    if (id !== undefined) {
      this.pendienteEliminar = null;
      this.eliminar.emit(id);
    }
  }
}
