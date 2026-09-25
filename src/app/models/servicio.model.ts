export interface Servicio {
  id?: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  imagen?: string;
  destacado: boolean;
  precio: number;
  activo: boolean;
  duracion?: string;
  descripcionDetalle?: string;
  horario?: string;
  incluidos?: string[];
  etiquetas?: string[];
}