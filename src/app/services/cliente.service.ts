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

  // Actualiza los datos de un cliente existente.
  actualizar(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(`${this.url}/${cliente.id}/perfil`, cliente);
  }

  // Cambia la contraseña de un cliente.
  cambiarContrasena(
    clienteId: number,
    contrasenaActual: string,
    nuevaContrasena: string,
    confirmarContrasena: string,
  ): Observable<void> {
    return this.http.post<void>(`${this.url}/${clienteId}/password`, {
      contrasenaActual,
      nuevaContrasena,
      confirmarContrasena,
    });
  }

  // Elimina la cuenta de un cliente.
  eliminarCuenta(clienteId: number): Observable<void> {
    return this.http.post<void>(`${this.url}/delete/${clienteId}`, null);
  }
}
