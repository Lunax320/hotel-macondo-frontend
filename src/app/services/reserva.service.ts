import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Reserva } from '../models/reserva.model';
import { ReservaDetalleOperador } from '../models/reserva-detalle-operador.model';
import { ReservaOperador } from '../models/reserva-operador.model';

// Servicio para operaciones de reserva contra el backend.
@Injectable({
  providedIn: 'root',
})
export class ReservaService {
  private http = inject(HttpClient);
  private url = 'http://localhost:8080/api/reserva';

  private readonly reservasDemostracion: Reserva[] = [
    {
      id: 1,
      numeroReserva: 'MHC-2025-001',
      fechaInicio: '2025-06-01',
      fechaFin: '2025-06-04',
      cantidadPersonas: 2,
      estado: 'ACTIVA',
      precioNoche: 280000,
      total: 840000,
      cliente: {
        id: 1,
        nombre: 'Úrsula',
        apellido: 'Iguarán',
        cedula: '101',
        telefono: '300101',
        correo: 'ursula@macondo.com',
      },
      habitacion: {
        id: 2,
        numero: '102',
        nombre: 'Habitación 102',
        estado: 'DISPONIBLE',
        capacidad: 2,
        precio: 280000,
        tipoHabitacion: {
          id: 1,
          nombre: 'Castaño Fundacional',
          descripcion:
            'Refugio íntimo con vista al gran patio de Macondo, cama queen y brisa fresca.',
          imagen: '/images/HabitacionNormal.avif',
          precioNoche: 280000,
          capacidadPersonas: 2,
        },
      },
    },
    {
      id: 2,
      numeroReserva: 'MHC-2025-002',
      fechaInicio: '2025-07-10',
      fechaFin: '2025-07-13',
      cantidadPersonas: 2,
      estado: 'CONFIRMADA',
      precioNoche: 450000,
      total: 1350000,
      cliente: {
        id: 2,
        nombre: 'José Arcadio',
        apellido: 'Buendía',
        cedula: '102',
        telefono: '300102',
        correo: 'josearcadio@macondo.com',
      },
      habitacion: {
        id: 12,
        numero: '202',
        nombre: 'Habitación 202',
        estado: 'DISPONIBLE',
        capacidad: 3,
        precio: 450000,
        tipoHabitacion: {
          id: 2,
          nombre: 'Orfebrería Buendía',
          descripcion:
            'Espacio distinguido con detalles artesanales en oro, balcón y sala de lectura.',
          imagen: '/images/HabitacionExecutive.avif',
          precioNoche: 450000,
          capacidadPersonas: 3,
        },
      },
    },
    {
      id: 3,
      numeroReserva: 'MHC-2024-089',
      fechaInicio: '2024-12-10',
      fechaFin: '2024-12-13',
      cantidadPersonas: 1,
      estado: 'FINALIZADA',
      precioNoche: 280000,
      total: 840000,
      cliente: {
        id: 3,
        nombre: 'Aureliano',
        apellido: 'Buendía',
        cedula: '103',
        telefono: '300103',
        correo: 'aureliano@macondo.com',
      },
      habitacion: {
        id: 22,
        numero: '302',
        nombre: 'Habitación 302',
        estado: 'DISPONIBLE',
        capacidad: 4,
        precio: 650000,
        tipoHabitacion: {
          id: 3,
          nombre: 'Mariposas Amarillas',
          descripcion:
            'Suite boutique luminosa decorada con motivos botánicos, cama king size y terraza caribeña.',
          imagen: '/images/HabitacionVIP.avif',
          precioNoche: 650000,
          capacidadPersonas: 4,
        },
      },
    },
  ];

  obtenerReservasOperador(): Observable<ReservaOperador[]> {
    return this.http.get<ReservaOperador[]>(this.url);
  }

  obtenerDetalleOperador(numeroReserva: string): Observable<ReservaDetalleOperador> {
    return this.http.get<ReservaDetalleOperador>(
      `${this.url}/${encodeURIComponent(numeroReserva)}`,
    );
  }

  cancelarReservaOperador(numeroReserva: string): Observable<ReservaOperador> {
    return this.http.post<ReservaOperador>(
      `${this.url}/${encodeURIComponent(numeroReserva)}/cancelar`,
      {},
    );
  }

  obtenerTodasDemostracion(): Reserva[] {
    return this.reservasDemostracion;
  }

  // Busca reservas activas de un cliente.
  buscarActivasPorCliente(clienteId: number): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${this.url}/cliente/${clienteId}/activas`);
  }

  // Busca historial de reservas de un cliente.
  buscarHistorialPorCliente(clienteId: number): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${this.url}/cliente/${clienteId}/historial`);
  }
}
