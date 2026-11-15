export interface ReservaOperador {
  id: number;
  numeroReserva: string;
  fechaInicio: string;
  fechaFin: string;
  cantidadPersonas: number;
  estado: string;
  precioNoche: number;
  total: number;
  cliente?: {
    id: number;
    nombre: string;
    apellido: string;
  };
  habitacion?: {
    id: number;
    numero: string;
    nombre: string;
    tipoHabitacion?: {
      id: number;
      nombre: string;
    };
  };
}
