import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OperadorSidebar } from '../../../components/operador-sidebar/operador-sidebar';
import { ModuloCuenta } from '../../../components/modulo-cuenta/modulo-cuenta';
import { ReservaService } from '../../../services/reserva.service';
import { cargarDatosOperador, EstadiaConSaldo } from '../inicio/estadias';

// Cuenta de habitación: lista las estadías en curso para elegir, y deja la búsqueda por número.
@Component({
  imports: [ModuloCuenta, OperadorSidebar, RouterLink, CurrencyPipe],
  selector: 'app-operador-buscar-cuenta',
  templateUrl: './buscar-cuenta.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class OperadorBuscarCuenta implements OnInit {
  private reservaServicio = inject(ReservaService);

  estadias: EstadiaConSaldo[] = [];
  cargando = signal(true);
  error = signal('');

  ngOnInit(): void {
    cargarDatosOperador(this.reservaServicio).subscribe({
      next: (datos) => {
        this.estadias = datos.enCurso;
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar la lista de estadías.');
        this.cargando.set(false);
      },
    });
  }
}
