import { DetalleCuenta } from './detalle-cuenta.model';
import { Pago } from './pago.model';

export interface Cuenta {
  id?: number;
  estado: string;
  total: number;
  fechaApertura: string;
  reservaId?: number;
  detalles?: DetalleCuenta[];
  pagos?: Pago[];
}