import { Usuario } from './usuario.model';

export interface Operador {
  id?: number;
  nombre: string;
  activo: boolean;
  usuario?: Usuario;
}
