import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private url = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  autenticar(correo: string, contrasena: string): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.url}/login`, { correo, contrasena });
  }
}
