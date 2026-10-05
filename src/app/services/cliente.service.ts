import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Cliente } from '../models/cliente.model';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private clienteArray: Cliente[] = [
    {
      id: 1,
      nombre: 'Úrsula',
      apellido: 'Iguarán',
      cedula: '101',
      telefono: '300101',
      correo: 'ursula@macondo.com',
    },
    {
      id: 2,
      nombre: 'José Arcadio',
      apellido: 'Buendía',
      cedula: '102',
      telefono: '300102',
      correo: 'josearcadio@macondo.com',
    },
    {
      id: 3,
      nombre: 'Aureliano',
      apellido: 'Buendía',
      cedula: '103',
      telefono: '300103',
      correo: 'aureliano@macondo.com',
    },
    {
      id: 4,
      nombre: 'Amaranta',
      apellido: 'Buendía',
      cedula: '104',
      telefono: '300104',
      correo: 'amaranta@macondo.com',
    },
    {
      id: 5,
      nombre: 'Rebeca',
      apellido: 'Montiel',
      cedula: '105',
      telefono: '300105',
      correo: 'rebeca@macondo.com',
    },
    {
      id: 6,
      nombre: 'Pietro',
      apellido: 'Crespi',
      cedula: '106',
      telefono: '300106',
      correo: 'pietro@macondo.com',
    },
    {
      id: 7,
      nombre: 'Gerineldo',
      apellido: 'Márquez',
      cedula: '107',
      telefono: '300107',
      correo: 'gerineldo@macondo.com',
    },
    {
      id: 8,
      nombre: 'Petra',
      apellido: 'Cotes',
      cedula: '108',
      telefono: '300108',
      correo: 'petra@macondo.com',
    },
    {
      id: 9,
      nombre: 'Mauricio',
      apellido: 'Babilonia',
      cedula: '109',
      telefono: '300109',
      correo: 'mauricio@macondo.com',
    },
    {
      id: 10,
      nombre: 'Meme',
      apellido: 'Buendía',
      cedula: '110',
      telefono: '300110',
      correo: 'meme@macondo.com',
    },
  ];

  obtenerTodos(): Cliente[] {
    return this.clienteArray;
  }

  obtenerPorId(id: number): Cliente | undefined {
    return this.clienteArray.find((cliente) => cliente.id === id);
  }

  // Métodos que simulan peticiones HTTP con of(); luego se cambian por this.http.*

  // Simula POST: agrega el cliente con un id nuevo.
  agregarCliente(cliente: Cliente): Observable<Cliente> {
    const nuevoCliente: Cliente = { ...cliente, id: this.obtenerSiguienteId() };
    this.clienteArray.push(nuevoCliente);
    return of({ ...nuevoCliente });
  }

  // Simula PUT: reemplaza el cliente con ese id.
  actualizarCliente(id: number, cliente: Cliente): Observable<Cliente | undefined> {
    const indice = this.clienteArray.findIndex((c) => c.id === id);

    if (indice === -1) {
      return of(undefined);
    }

    this.clienteArray[indice] = { ...cliente, id };
    return of({ ...this.clienteArray[indice] });
  }

  // Verifica si ya hay un cliente con esa cédula (en la base de datos es única).
  existeCedula(cedula: string): boolean {
    return this.clienteArray.some((cliente) => cliente.cedula === cedula.trim());
  }

  // Simula GET por id.
  buscarPorId(id: number): Observable<Cliente | undefined> {
    const cliente = this.clienteArray.find((c) => c.id === id);
    return of(cliente ? { ...cliente } : undefined);
  }

  private obtenerSiguienteId(): number {
    const ids = this.clienteArray
      .map((cliente) => cliente.id)
      .filter((id): id is number => id !== undefined);

    return Math.max(0, ...ids) + 1;
  }
}
