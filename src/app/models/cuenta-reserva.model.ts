export interface CuentaReserva {
  id: number;
  estado: string;
  total: number;
  fechaApertura: string;
  consumos: {
    id: number;
    cantidad: number;
    precio: number;
    fechaRegistro: string;
    servicio: string | null;
  }[];
  pagos: {
    id: number;
    monto: number;
    metodoPago: string;
    fechaPago: string;
    estado: string;
  }[];
}
