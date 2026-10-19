import { Cliente } from './cliente.model';
import { CuentaReserva } from './cuenta-reserva.model';
import { HabitacionDetalleOperador } from './habitacion-detalle-operador.model';
import { Reserva } from './reserva.model';

export interface ReservaDetalleOperador extends Omit<Reserva, 'cliente' | 'habitacion'> {
  cliente?: Cliente | null;
  habitacion?: HabitacionDetalleOperador | null;
  cuenta?: CuentaReserva | null;
}
