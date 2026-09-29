import { TipoHabitacion } from './tipo-habitacion.model';

export interface Habitacion {
  id?: number;
  numero: string;
  nombre: string;
  estado: string;
  capacidad: number;
  precio: number;
  etiqueta?: string;
  descripcion?: string;
  imagen?: string;
  piso?: number;
  tipoHabitacionId?: number;
  tipoHabitacion?: TipoHabitacion;
}