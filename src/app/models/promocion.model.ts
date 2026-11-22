export interface Promocion {
  id?: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  tipoDescuento: 'PORCENTAJE' | 'VALOR_FIJO';
  valorDescuento: number;
  fechaInicio: string;
  fechaFin: string;
  nochesMinimas: number;
  activa: boolean;
}

export interface PromocionAplicada {
  codigo: string | null;
  nombre: string | null;
  subtotalEstadia: number;
  descuento: number;
  total: number;
}
