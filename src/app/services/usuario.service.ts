import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { Cliente } from '../models/cliente.model';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private usuarioArray: Usuario[] = [
    // Administrador: admin@macondo.com / admin
    { id: 1, correo: 'admin@macondo.com', contrasena: 'admin', rol: 'ADMINISTRADOR' },
    // Operador: operador@macondo.com / ope
    { id: 2, correo: 'operador@macondo.com', contrasena: 'ope', rol: 'OPERADOR' },
    // Clientes: clave 123
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

  autenticar(correo: string, contrasena: string): Usuario | null {
    const usuarioEncontrado = this.usuarioArray.find(
      (usuario) =>
        usuario.correo.toLowerCase() === correo.toLowerCase() && usuario.contrasena === contrasena,
    );
    return usuarioEncontrado || null;
  }

  // Registro de clientes

  // Verifica si existe un usuario con ese correo (case-insensitive).
  existeCorreo(correo: string): boolean {
    return this.usuarioArray.some(
      (usuario) => usuario.correo.toLowerCase() === correo.toLowerCase(),
    );
  }

  // Registra un nuevo usuario CLIENTE vinculado al cliente ya guardado.
  // Devuelve null si el correo ya existe.
  registrarCliente(cliente: Cliente, contrasena: string): Observable<Usuario | null> {
    if (this.existeCorreo(cliente.correo)) {
      return of(null);
    }

    const nuevoUsuario: Usuario = {
      id: this.obtenerSiguienteId(),
      correo: cliente.correo,
      contrasena,
      rol: 'CLIENTE',
      cliente: { ...cliente },
    };

    this.usuarioArray.push(nuevoUsuario);
    return of({ ...nuevoUsuario });
  }

  private obtenerSiguienteId(): number {
    const ids = this.usuarioArray
      .map((usuario) => usuario.id)
      .filter((id): id is number => id !== undefined);

    return Math.max(0, ...ids) + 1;
  }
}
