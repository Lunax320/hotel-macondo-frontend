import { Cliente } from './cliente.model';
import { Habitacion } from './habitacion.model';

export interface Reserva {
  id?: number;
  numeroReserva: string;
  fechaInicio: string;
  fechaFin: string;
  cantidadPersonas: number;
  estado: string;
  precioNoche?: number;
  total: number;
  codigoPromocional?: string;
  descuentoPromocional?: number;
  cliente?: Cliente;
  habitacion?: Habitacion;
}
