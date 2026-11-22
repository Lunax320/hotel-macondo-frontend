export interface ReservaDetalleCliente {
  id: number;
  numeroReserva: string;
  fechaInicio: string;
  fechaFin: string;
  cantidadPersonas: number;
  estado: string;
  precioNoche: number;
  total: number;
  habitacion: string | null;
  tipoHabitacion: string | null;
  cuenta: {
    id: number;
    estado: string;
    total: number;
    saldo: number;
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
  } | null;
}
