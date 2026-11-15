import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { AdminSidebar } from '../../../components/admin-sidebar/admin-sidebar';
import { ReservaOperador } from '../../../models/reserva-operador.model';
import { HabitacionService } from '../../../services/habitacion.service';
import { OperadorService } from '../../../services/operador.service';
import { ReservaService } from '../../../services/reserva.service';
import { ServicioService } from '../../../services/servicio.service';
import { TipoHabitacionService } from '../../../services/tipo-habitacion.service';
import { TarjetaResumen } from './components/tarjeta-resumen/tarjeta-resumen';
import { BienvenidaAdmin } from './components/bienvenida-admin/bienvenida-admin';

interface BarraEstado {
  etiqueta: string;
  cantidad: number;
  porcentaje: number;
  color: string;
}

interface TarjetaDato {
  nombre: string;
  valor: number | null;
  error: string;
  icono: string;
  sufijo?: string;
}

interface DiaOcupacion {
  etiqueta: string;
  ocupadas: number;
}

// Resume la información administrativa del hotel.
@Component({
  imports: [AdminSidebar, TarjetaResumen, BienvenidaAdmin, RouterLink],
  selector: 'app-admin-inicio',
  templateUrl: './admin-inicio.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class AdminInicio implements OnInit {
  private operadorService = inject(OperadorService);
  private servicioService = inject(ServicioService);
  private habitacionService = inject(HabitacionService);
  private tipoService = inject(TipoHabitacionService);
  private reservaService = inject(ReservaService);

  // null = cargando; el error de cada sección es independiente para que una falla no rompa el resto
  totalOperadores: number | null = null;
  operadoresActivos: number | null = null;
  totalServicios: number | null = null;
  serviciosActivos: number | null = null;
  totalHabitaciones: number | null = null;
  habitacionesDisponibles: number | null = null;
  habitacionesOcupadas: number | null = null;
  totalTipos: number | null = null;
  errores = { operadores: '', servicios: '', habitaciones: '', tipos: '', reservas: '' };

  reservasCargadas = false;
  llegadas: ReservaOperador[] = [];
  salidas: ReservaOperador[] = [];
  barras: BarraEstado[] = [];

  private reservas: ReservaOperador[] = [];

  reservasActivas = 0;
  reservasMes = 0;
  dias: DiaOcupacion[] = [];

  get hayError(): boolean {
    return Object.values(this.errores).some((e) => e);
  }

  get ocupacionPct(): number | null {
    if (!this.totalHabitaciones || this.habitacionesOcupadas === null) return null;
    return Math.round((this.habitacionesOcupadas / this.totalHabitaciones) * 100);
  }

  get kpis(): TarjetaDato[] {
    const pct = this.ocupacionPct;
    return [
      { nombre: 'Habitaciones totales', valor: this.totalHabitaciones, error: this.errores.habitaciones, icono: 'bi-building' },
      { nombre: 'Ocupadas hoy', valor: this.habitacionesOcupadas, error: this.errores.reservas || this.errores.habitaciones, icono: 'bi-door-closed' },
      { nombre: 'Reservas activas', valor: this.reservasCargadas ? this.reservasActivas : null, error: this.errores.reservas, icono: 'bi-calendar-check' },
      { nombre: 'Reservas del mes', valor: this.reservasCargadas ? this.reservasMes : null, error: this.errores.reservas, icono: 'bi-calendar3' },
      { nombre: 'Ocupación', valor: pct, error: this.errores.reservas || this.errores.habitaciones, icono: 'bi-pie-chart', sufijo: '%' },
    ];
  }

  // Altura de la barra en % del total de habitaciones (el total puede llegar después que las reservas).
  alto(d: DiaOcupacion): number {
    return this.totalHabitaciones ? Math.min(100, Math.round((d.ocupadas / this.totalHabitaciones) * 100)) : 0;
  }

  reintentar(): void {
    this.errores = { operadores: '', servicios: '', habitaciones: '', tipos: '', reservas: '' };
    this.ngOnInit();
  }

  irAComentarios(): void {
    document.getElementById('titulo-comentarios')?.scrollIntoView({ behavior: 'smooth' });
  }

  ngOnInit(): void {
    this.cargar(this.operadorService.listar(), 'operadores', (lista) => {
      this.totalOperadores = lista.length;
      this.operadoresActivos = lista.filter((item) => item.activo).length;
    });
    this.cargar(this.servicioService.buscarTodos(), 'servicios', (lista) => {
      this.totalServicios = lista.length;
      this.serviciosActivos = lista.filter((item) => item.activo).length;
    });
    this.cargar(this.tipoService.listarTipos(), 'tipos', (lista) => {
      this.totalTipos = lista.length;
    });
    this.cargar(this.habitacionService.listarHabitaciones(), 'habitaciones', (lista) => {
      this.totalHabitaciones = lista.length;
      this.habitacionesDisponibles = lista.filter((h) => h.estado === 'DISPONIBLE').length;
    });
    this.cargar(this.reservaService.obtenerReservasOperador(), 'reservas', (lista) => {
      this.reservas = lista;
      this.calcularReservas();
      this.reservasCargadas = true;
    });
  }

  // Tarjetas de resumen (se calculan en cada ciclo; son 4 objetos).
  get tarjetas(): TarjetaDato[] {
    return [
      { nombre: 'Operadores activos', valor: this.operadoresActivos, error: this.errores.operadores, icono: 'bi-person-badge' },
      { nombre: 'Servicios activos', valor: this.serviciosActivos, error: this.errores.servicios, icono: 'bi-stars' },
      { nombre: 'Habitaciones disponibles', valor: this.habitacionesDisponibles, error: this.errores.habitaciones, icono: 'bi-door-open' },
    ];
  }

  private cargar<T>(
    peticion: Observable<T>,
    seccion: keyof AdminInicio['errores'],
    alExito: (datos: T) => void,
  ): void {
    peticion.subscribe({
      next: alExito,
      error: () => {
        this.errores[seccion] = 'No se pudo cargar esta información.';
      },
    });
  }

  private calcularReservas(): void {
    const hoy = this.fechaLocal(0);
    const limite = this.fechaLocal(7);
    const estado = (r: ReservaOperador) => r.estado.toUpperCase();
    this.llegadas = this.reservas
      .filter((r) => estado(r) === 'CONFIRMADA' && r.fechaInicio >= hoy && r.fechaInicio <= limite)
      .sort((a, b) => a.fechaInicio.localeCompare(b.fechaInicio));
    this.salidas = this.reservas.filter((r) => estado(r) === 'ACTIVA' && r.fechaFin === hoy);

    // El backend solo conoce DISPONIBLE/NO_DISPONIBLE; "ocupada" = habitación con una reserva ACTIVA.
    this.habitacionesOcupadas = new Set(
      this.reservas.filter((r) => estado(r) === 'ACTIVA' && r.habitacion).map((r) => r.habitacion!.id),
    ).size;

    this.reservasActivas = this.reservas.filter((r) => estado(r) === 'ACTIVA').length;
    const mes = hoy.slice(0, 7);
    this.reservasMes = this.reservas.filter((r) => r.fechaInicio.startsWith(mes) && estado(r) !== 'CANCELADA').length;

    // Ocupación por día: habitaciones distintas con reserva ACTIVA/CONFIRMADA que cubre la noche (inicio <= día < fin).
    this.dias = Array.from({ length: 7 }, (_, i) => {
      const dia = this.fechaLocal(i);
      const ocupadas = new Set(
        this.reservas
          .filter((r) => ['ACTIVA', 'CONFIRMADA'].includes(estado(r)) && r.habitacion && r.fechaInicio <= dia && dia < r.fechaFin)
          .map((r) => r.habitacion!.id),
      ).size;
      const [, m, d] = dia.split('-');
      return { etiqueta: `${d}/${m}`, ocupadas };
    });

    const defs: [string, string, string][] = [
      ['Activas', 'ACTIVA', 'bg-[var(--azul)]'],
      ['Confirmadas', 'CONFIRMADA', 'bg-[var(--dorado-oscuro)]'],
      ['Canceladas', 'CANCELADA', 'bg-red-400'],
      ['Finalizadas', 'FINALIZADA', 'bg-emerald-500'],
    ];
    const base = this.reservas.length || 1;
    this.barras = defs.map(([etiqueta, clave, color]) => {
      const cantidad = this.reservas.filter((r) => estado(r) === clave).length;
      return { etiqueta, cantidad, porcentaje: Math.round((cantidad / base) * 100), color };
    });
  }

  // Fecha local yyyy-MM-dd desplazada n días (toISOString usa UTC y de noche daría otro día).
  private fechaLocal(dias: number): string {
    const d = new Date();
    d.setDate(d.getDate() + dias);
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    return `${d.getFullYear()}-${mes}-${String(d.getDate()).padStart(2, '0')}`;
  }

  nombreHuesped(r: ReservaOperador): string {
    return r.cliente ? `${r.cliente.nombre} ${r.cliente.apellido}` : 'Huésped sin datos';
  }
}
