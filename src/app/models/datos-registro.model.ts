import { Cliente } from './cliente.model';

// Datos que el formulario de registro le entrega a la página.
export interface DatosRegistro {
  cliente: Cliente;
  contrasena: string;
}
