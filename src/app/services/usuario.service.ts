import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario.model';

// Servicio de autenticación local usado por el inicio de sesión.
@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private usuarioArray: Usuario[] = [
    { id: 1, correo: 'admin@macondo.com', contrasena: 'admin', rol: 'ADMINISTRADOR' },
    { id: 2, correo: 'operador@macondo.com', contrasena: 'ope', rol: 'OPERADOR' },
    {
      id: 3,
      correo: 'ursula@macondo.com',
      contrasena: '123',
      rol: 'CLIENTE',
      cliente: {
        id: 1,
        nombre: 'Úrsula',
        apellido: 'Iguarán',
        cedula: '101',
        telefono: '300101',
        correo: 'ursula@macondo.com',
      },
    },
    {
      id: 4,
      correo: 'josearcadio@macondo.com',
      contrasena: '123',
      rol: 'CLIENTE',
      cliente: {
        id: 2,
        nombre: 'José Arcadio',
        apellido: 'Buendía',
        cedula: '102',
        telefono: '300102',
        correo: 'josearcadio@macondo.com',
      },
    },
    {
      id: 5,
      correo: 'aureliano@macondo.com',
      contrasena: '123',
      rol: 'CLIENTE',
      cliente: {
        id: 3,
        nombre: 'Aureliano',
        apellido: 'Buendía',
        cedula: '103',
        telefono: '300103',
        correo: 'aureliano@macondo.com',
      },
    },
    {
      id: 6,
      correo: 'amaranta@macondo.com',
      contrasena: '123',
      rol: 'CLIENTE',
      cliente: {
        id: 4,
        nombre: 'Amaranta',
        apellido: 'Buendía',
        cedula: '104',
        telefono: '300104',
        correo: 'amaranta@macondo.com',
      },
    },
    {
      id: 7,
      correo: 'rebeca@macondo.com',
      contrasena: '123',
      rol: 'CLIENTE',
      cliente: {
        id: 5,
        nombre: 'Rebeca',
        apellido: 'Montiel',
        cedula: '105',
        telefono: '300105',
        correo: 'rebeca@macondo.com',
      },
    },
  ];

  // Autentica un usuario por correo y contraseña.
  autenticar(correo: string, contrasena: string): Usuario | null {
    const usuarioEncontrado = this.usuarioArray.find(
      (usuario) =>
        usuario.correo.toLowerCase() === correo.toLowerCase() && usuario.contrasena === contrasena,
    );
    return usuarioEncontrado || null;
  }
}
