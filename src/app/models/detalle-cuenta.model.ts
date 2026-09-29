import { Servicio } from './servicio.model';

export interface DetalleCuenta {
  id?: number;
  cantidad: number;
  precio: number;
  fechaRegistro: string;
  cuentaId?: number;
  servicioId?: number;
  servicio?: Servicio;
}