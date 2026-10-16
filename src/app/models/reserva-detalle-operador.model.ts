import { Cliente } from './cliente.model';
import { Reserva } from './reserva.model';

export interface ReservaDetalleOperador extends Omit<Reserva, 'cliente' | 'habitacion'> {
  cliente?: Cliente | null;
  habitacion?: {
    id: number;
    nombre: string;
    etiqueta?: string | null;
    precio: number;
    capacidad: number;
    numero: string;
    estado: string;
    piso?: number | null;
    tipoHabitacion?: {
      id: number;
      nombre: string;
      descripcion: string;
      imagen: string;
      precioNoche: number;
      capacidadPersonas: number;
    } | null;
  } | null;
  cuenta?: {
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
  } | null;
}
