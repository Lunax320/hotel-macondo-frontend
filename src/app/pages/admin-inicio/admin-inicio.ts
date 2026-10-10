import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { AdminSidebar } from '../../components/admin-sidebar/admin-sidebar';
import { HabitacionService } from '../../services/habitacion.service';
import { OperadorService } from '../../services/operador.service';
import { ServicioService } from '../../services/servicio.service';
import { TarjetaResumen } from './components/tarjeta-resumen/tarjeta-resumen';
import { BienvenidaAdmin } from './components/bienvenida-admin/bienvenida-admin';

// Resume la información administrativa del hotel.
@Component({
  imports: [AdminSidebar, TarjetaResumen, BienvenidaAdmin],
  selector: 'app-admin-inicio',
  templateUrl: './admin-inicio.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class AdminInicio implements OnInit {
  private operadorService = inject(OperadorService);
  private servicioService = inject(ServicioService);
  private habitacionService = inject(HabitacionService);

  totalOperadores = 0;
  operadoresActivos = 0;
  totalServicios = 0;
  serviciosActivos = 0;
  totalHabitaciones = 0;
  habitacionesDisponibles = 0;
  errorResumen = '';

  // Inicializa el componente cargando los conteos del tablero.
  ngOnInit(): void {
    this.cargarResumen();
  }

  // Carga los conteos independientes del tablero.
  private cargarResumen(): void {
    this.operadorService.listar().subscribe({
      next: (lista) => {
        this.totalOperadores = lista.length;
        this.operadoresActivos = lista.filter((item) => item.activo).length;
      },
      error: () => {
        this.errorResumen = 'No se pudo cargar el resumen del hotel.';
      },
    });

    this.servicioService.buscarTodos().subscribe({
      next: (lista) => {
        this.totalServicios = lista.length;
        this.serviciosActivos = lista.filter((item) => item.activo).length;
      },
      error: () => {
        this.errorResumen = 'No se pudo cargar el resumen del hotel.';
      },
    });

    this.habitacionService.listarHabitaciones().subscribe({
      next: (lista) => {
        this.totalHabitaciones = lista.length;
        this.habitacionesDisponibles = lista.filter((item) => item.estado === 'DISPONIBLE').length;
      },
      error: () => {
        this.errorResumen = 'No se pudo cargar el resumen del hotel.';
      },
    });
  }
}
