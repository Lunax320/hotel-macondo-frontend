import { Cuenta } from './cuenta.model';
import { Servicio } from './servicio.model';

export interface DetalleCuenta {
  id?: number;
  cantidad: number;
  precio: number;
  fechaRegistro: string;
  cuenta?: Cuenta;
  servicio?: Servicio;
}
