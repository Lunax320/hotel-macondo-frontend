import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente.model';

// Servicio para operaciones de cliente contra el backend.
@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private http = inject(HttpClient);
  private url = 'http://localhost:8080/api/cliente';

  // Busca un cliente por su id.
  buscarPorId(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.url}/find/${id}`);
  }

  // Registra un nuevo cliente con contraseña.
  registrar(cliente: Cliente, contrasena: string): Observable<Cliente> {
    return this.http.post<Cliente>(`${this.url}/registro`, { cliente, contrasena });
  }
}
