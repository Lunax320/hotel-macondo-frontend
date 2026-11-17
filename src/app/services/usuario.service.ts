import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { Rol } from '../models/rol.model';

interface SesionUsuario {
  rol: Rol;
  roles: Rol[];
  clienteId?: number;
}

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private url = 'http://localhost:8080/api/auth';
  private router = inject(Router);

  constructor(private http: HttpClient) {}

  // Envía el correo y la contraseña al endpoint de autenticación.
  autenticar(correo: string, contrasena: string): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.url}/login`, { correo, contrasena }).pipe(
      tap((usuario) => {
        if (!usuario.token || !this.tokenVigente(usuario.token)) {
          throw new Error('El servidor no devolvió un token válido.');
        }
        const sesion: SesionUsuario = {
          rol: usuario.rol,
          roles: usuario.roles?.length ? usuario.roles : [usuario.rol],
          clienteId: usuario.cliente?.id,
        };
        localStorage.setItem('token', usuario.token);
        localStorage.setItem('sesionUsuario', JSON.stringify(sesion));
        if (!this.obtenerSesion()) {
          throw new Error('La cuenta no tiene un rol o un perfil válido.');
        }
      }),
    );
  }

  // La firma se verifica en el backend; aquí solo se comprueba el vencimiento.
  private tokenVigente(token: string): boolean {
    try {
      const partes = token.split('.');
      if (partes.length !== 3 || !partes[2]) return false;
      const contenido = partes[1].replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(contenido.padEnd(Math.ceil(contenido.length / 4) * 4, '=')));
      return typeof payload.exp === 'number' && payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  obtenerToken(): string | null {
    const token = localStorage.getItem('token');
    if (!token || !this.tokenVigente(token)) {
      this.limpiarSesion();
      return null;
    }
    return token;
  }

  obtenerSesion(): SesionUsuario | null {
    if (!this.obtenerToken()) return null;
    try {
      const sesion: SesionUsuario | null = JSON.parse(
        localStorage.getItem('sesionUsuario') ?? 'null',
      );
      const roles: Rol[] = ['ADMINISTRADOR', 'OPERADOR', 'CLIENTE'];
      if (
        !sesion ||
        !roles.includes(sesion.rol) ||
        !Array.isArray(sesion.roles) ||
        !sesion.roles.length ||
        !sesion.roles.every((rol) => roles.includes(rol))
      ) {
        throw new Error('Sesión inválida');
      }
      if (
        !sesion.roles.includes('ADMINISTRADOR') &&
        !sesion.roles.includes('OPERADOR') &&
        (!Number.isInteger(sesion.clienteId) || (sesion.clienteId ?? 0) < 1)
      ) {
        throw new Error('Falta el cliente asociado');
      }
      return sesion;
    } catch {
      this.limpiarSesion();
      return null;
    }
  }

  rutaInicio(sesion = this.obtenerSesion()): string {
    if (sesion?.roles.includes('ADMINISTRADOR')) return '/admin';
    if (sesion?.roles.includes('OPERADOR')) return '/operador';
    if (sesion?.clienteId) return `/cliente/${sesion.clienteId}`;
    return '/login';
  }

  limpiarSesion(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('sesionUsuario');
  }

  cerrarSesion(): void {
    this.limpiarSesion();
    void this.router.navigateByUrl('/login');
  }
}
