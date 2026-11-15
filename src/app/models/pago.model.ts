import { Cuenta } from './cuenta.model';

export interface Pago {
  id?: number;
  monto: number;
  metodoPago: string;
  fechaPago: string;
  estado: string;
  cuenta?: Cuenta;
}
