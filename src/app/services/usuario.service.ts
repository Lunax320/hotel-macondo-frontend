import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  data: Usuario[] = [
    // Administrador: admin@macondo.com / admin
    { id: 1, correo: 'admin@macondo.com', contrasena: 'admin', rol: 'ADMINISTRADOR' },
    // Operador: operador@macondo.com / ope
    { id: 2, correo: 'operador@macondo.com', contrasena: 'ope', rol: 'OPERADOR' },
    // Clientes: clave 123
    { id: 3, correo: 'ursula@macondo.com', contrasena: '123', rol: 'CLIENTE', clienteId: 1 },
    { id: 4, correo: 'josearcadio@macondo.com', contrasena: '123', rol: 'CLIENTE', clienteId: 2 },
    { id: 5, correo: 'aureliano@macondo.com', contrasena: '123', rol: 'CLIENTE', clienteId: 3 },
    { id: 6, correo: 'amaranta@macondo.com', contrasena: '123', rol: 'CLIENTE', clienteId: 4 },
    { id: 7, correo: 'rebeca@macondo.com', contrasena: '123', rol: 'CLIENTE', clienteId: 5 }
  ];

  autenticar(correo: string, contrasena: string): Usuario | null {
    const usuarioEncontrado = this.data.find(
      u => u.correo.toLowerCase() === correo.toLowerCase() && u.contrasena === contrasena
    );
    return usuarioEncontrado || null;
  }
}