import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private url = 'http://localhost:8080/api/auth';

  private http = inject(HttpClient);

  // Envía el correo y la contraseña al endpoint de autenticación.
  autenticar(correo: string, contrasena: string): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.url}/login`, { correo, contrasena });
  }
}
