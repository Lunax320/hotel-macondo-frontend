import { API_BASE } from '../config/api';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private url = `${API_BASE}/api/auth`;

  constructor(private http: HttpClient) {}

  // Envía el correo y la contraseña al endpoint de autenticación.
  autenticar(correo: string, contrasena: string): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.url}/login`, { correo, contrasena });
  }
}
