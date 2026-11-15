import { DetalleCuenta } from './detalle-cuenta.model';
import { Pago } from './pago.model';
import { Reserva } from './reserva.model';

export interface Cuenta {
  id?: number;
  estado: string;
  total: number;
  fechaApertura: string;
  reserva?: Reserva;
  detalles?: DetalleCuenta[];
  pagos?: Pago[];
}
