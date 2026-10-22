// Datos editables enviados al backend; identidad, asociaciones y precios los resuelve Spring.
export interface ReservaSolicitud {
  fechaInicio: string;
  fechaFin: string;
  cantidadPersonas: number;
}
