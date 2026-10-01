import { Cliente } from './cliente.model';
import { Rol } from './rol.model';

export interface Usuario {
  id?: number;
  correo: string;
  contrasena?: string;
  rol: Rol;
  cliente?: Cliente;
}
