import { catchError, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { ReservaOperador } from '../../../models/reserva-operador.model';
import { ReservaService } from '../../../services/reserva.service';

// Reserva en curso (ACTIVA) con lo que le falta por pagar; saldo null si no se pudo leer la cuenta.
export interface EstadiaConSaldo {
  reserva: ReservaOperador;
  saldo: number | null;
}

export interface DatosOperador {
  reservas: ReservaOperador[];
  enCurso: EstadiaConSaldo[];
}

// Carga las reservas y el saldo de cada estadía en curso en un solo flujo
// (ponytail: un GET de detalle por estadía activa; sirve para el volumen de un hotel boutique).
export function cargarDatosOperador(servicio: ReservaService): Observable<DatosOperador> {
  return servicio.obtenerReservasOperador().pipe(
    switchMap((reservas) => {
      const activas = reservas.filter((r) => r.estado === 'ACTIVA');
      const saldos = activas.map((r) =>
        servicio.obtenerDetalleOperadorPorId(r.id).pipe(
          map((d) => {
            const pagado = d.cuenta?.pagos.reduce((s, p) => s + p.monto, 0) ?? 0;
            return d.cuenta ? Math.max(d.cuenta.total - pagado, 0) : null;
          }),
          catchError(() => of(null)),
        ),
      );
      return (saldos.length ? forkJoin(saldos) : of([] as (number | null)[])).pipe(
        map((s) => ({ reservas, enCurso: activas.map((reserva, i) => ({ reserva, saldo: s[i] })) })),
      );
    }),
  );
}

export function hoyISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
