import { TestBed } from '@angular/core/testing';
import { Reserva } from '../models/reserva.model';
import { ReservaService } from './reserva.service';

describe('ReservaService', () => {
  let reservaService: ReservaService;

  beforeEach(() => {
    reservaService = TestBed.inject(ReservaService);
  });

  it('buscarPorCliente devuelve solo las reservas de ese cliente', () => {
    let reservas: Reserva[] = [];
    reservaService.buscarPorCliente(1).subscribe((r) => (reservas = r));

    expect(reservas.length).toBeGreaterThan(0);
    expect(reservas.every((reserva) => reserva.cliente?.id === 1)).toBe(true);
  });

  it('cancelarReserva deja la reserva en estado CANCELADA', () => {
    let cancelada: Reserva | undefined;
    reservaService.cancelarReserva(1).subscribe((r) => (cancelada = r));

    expect(cancelada?.estado).toBe('CANCELADA');
  });
});
