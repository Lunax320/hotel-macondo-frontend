import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private http = inject(HttpClient);
  private url = 'http://localhost:8080/api/auth';

  autenticar(correo: string, contrasena: string): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.url}/login`, { correo, contrasena });
  }
}