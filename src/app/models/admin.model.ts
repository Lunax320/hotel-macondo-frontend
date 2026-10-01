import { Usuario } from './usuario.model';

export interface Admin {
  id?: number;
  nombre: string;
  usuario?: Usuario;
}
