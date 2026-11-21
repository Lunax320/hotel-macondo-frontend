import { Cliente } from './cliente.model';
import { Rol } from './rol.model';

export interface Usuario {
  id?: number;
  correo: string;
  rol: Rol;
  roles?: Rol[];
  cliente?: Cliente;
  token?: string;
}
