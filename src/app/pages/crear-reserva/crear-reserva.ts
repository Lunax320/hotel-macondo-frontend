import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarCliente } from '../../components/navbar-cliente/navbar-cliente';
import { TipoHabitacion } from '../../models/tipo-habitacion.model';
import { TipoHabitacionService } from '../../services/tipo-habitacion.service';
import { ReservaInstrucciones } from './components/reserva-instrucciones/reserva-instrucciones';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-crear-reserva',
  imports: [FormsModule, NavbarCliente, ReservaInstrucciones, DecimalPipe],
  templateUrl: './crear-reserva.html',
  styleUrl: './crear-reserva.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class CrearReserva implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private tipoHabitacionService = inject(TipoHabitacionService);

  clienteId = 0;
  tiposHabitacion: TipoHabitacion[] = [];

  tipoId: number | '' = '';
  fechaEntrada = '';
  fechaSalida = '';
  cantidadPersonas = 2;

  fechaMinima = new Date().toISOString().split('T')[0];
  disponibilidadConsultada = false;
  hayDisponibilidad = false;
  cantidadDisponibles = 0;
  mensajeError = '';

  ngOnInit(): void {
    this.clienteId = Number(this.route.snapshot.params['id']);

    this.tipoHabitacionService.obtenerTodos().subscribe({
      next: (tipos) => {
        this.tiposHabitacion = tipos;
        const paramTipo = this.route.snapshot.queryParams['tipoId'];
        if (paramTipo) {
          this.tipoId = Number(paramTipo);
        }
      },
    });
  }

  consultarDisponibilidad(): void {
    this.mensajeError = '';
    if (!this.tipoId || !this.fechaEntrada || !this.fechaSalida || !this.cantidadPersonas) {
      this.mensajeError = 'Por favor completa todos los campos del formulario.';
      return;
    }

    if (new Date(this.fechaSalida) <= new Date(this.fechaEntrada)) {
      this.mensajeError = 'La fecha de salida debe ser posterior a la de entrada.';
      return;
    }

    this.disponibilidadConsultada = true;
    this.hayDisponibilidad = true;
    this.cantidadDisponibles = 3;
  }

  confirmarReserva(): void {
    alert('¡Reserva confirmada con éxito!');
    this.router.navigate(['/cliente', this.clienteId, 'reservas']);
  }
}