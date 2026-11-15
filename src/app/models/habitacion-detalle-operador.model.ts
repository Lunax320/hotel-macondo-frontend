export interface HabitacionDetalleOperador {
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
}
