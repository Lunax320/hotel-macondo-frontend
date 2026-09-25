export interface Pago {
  id?: number;
  monto: number;
  metodoPago: string;
  fechaPago: string;
  estado: string;
  cuentaId?: number;
}