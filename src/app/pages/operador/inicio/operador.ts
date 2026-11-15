import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OperadorSidebar } from '../../../components/operador-sidebar/operador-sidebar';
import { ReservaOperador } from '../../../models/reserva-operador.model';
import { ReservaService } from '../../../services/reserva.service';
import { EstadiaConSaldo, cargarDatosOperador, hoyISO } from './estadias';

@Component({
  imports: [OperadorSidebar, RouterLink, CurrencyPipe, DatePipe],
  selector: 'app-operador',
  styleUrl: './operador.scss',
  templateUrl: './operador.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class Operador implements OnInit {
  private reservaServicio = inject(ReservaService);

  cargando = true;
  error = '';
  hoy = hoyISO();
  resumen: { etiqueta: string; valor: number; icono: string }[] = [];
  proximasLlegadas: ReservaOperador[] = [];
  conSaldo: EstadiaConSaldo[] = [];

  // Un solo flujo: reservas + saldo de las estadías en curso.
  ngOnInit(): void {
    cargarDatosOperador(this.reservaServicio).subscribe({
      next: ({ reservas, enCurso }) => {
        const entrantes = reservas
          .filter((r) => r.estado === 'CONFIRMADA' && r.fechaInicio >= this.hoy)
          .sort((a, b) => a.fechaInicio.localeCompare(b.fechaInicio));
        this.resumen = [
          { etiqueta: 'Llegadas de hoy', valor: entrantes.filter((r) => r.fechaInicio === this.hoy).length, icono: 'bi-box-arrow-in-right' },
          { etiqueta: 'Salidas de hoy', valor: enCurso.filter((e) => e.reserva.fechaFin === this.hoy).length, icono: 'bi-box-arrow-right' },
          { etiqueta: 'Cuentas abiertas', valor: enCurso.length, icono: 'bi-receipt' },
        ];
        this.proximasLlegadas = entrantes.slice(0, 5);
        this.conSaldo = enCurso.filter((e) => (e.saldo ?? 0) > 0).slice(0, 5);
        this.cargando = false;
      },
      error: () => {
        this.error = 'No fue posible cargar el resumen. Las acciones principales siguen disponibles.';
        this.cargando = false;
      },
    });
  }
}
