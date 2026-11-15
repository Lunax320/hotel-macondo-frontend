export interface PagoCliente {
  id: number;
  numeroReserva: string;
  monto: number;
  metodoPago: string;
  fechaPago: string;
  estado: string;
}
