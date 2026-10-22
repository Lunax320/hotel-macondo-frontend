import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { mergeMap, Observable, Subscription } from 'rxjs';
import { NavbarCliente } from '../../../components/navbar-cliente/navbar-cliente';
import { Cliente } from '../../../models/cliente.model';
import { Reserva } from '../../../models/reserva.model';
import { ReservaSolicitud } from '../../../models/reserva-solicitud.model';
import { TipoHabitacion } from '../../../models/tipo-habitacion.model';
import { ClienteService } from '../../../services/cliente.service';
import { ReservaService } from '../../../services/reserva.service';
import { TipoHabitacionService } from '../../../services/tipo-habitacion.service';
import { ReservaDisponibilidad } from './components/reserva-disponibilidad/reserva-disponibilidad';
import { ReservaFormulario } from './components/reserva-formulario/reserva-formulario';
import { ReservaInstrucciones } from './components/reserva-instrucciones/reserva-instrucciones';

@Component({
  selector: 'app-crear-reserva',
  imports: [
    ReactiveFormsModule,
    NavbarCliente,
    ReservaFormulario,
    ReservaDisponibilidad,
    ReservaInstrucciones,
  ],
  templateUrl: './crear-reserva.html',
  styleUrl: './crear-reserva.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class CrearReserva implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private clienteService = inject(ClienteService);
  private tipoHabitacionService = inject(TipoHabitacionService);
  private reservaService = inject(ReservaService);
  private cambiosRuta?: Subscription;
  private carga?: Subscription;
  private consulta?: Subscription;
  private guardado?: Subscription;
  private criteriosConsultados = '';

  clienteId = 0;
  reservaId?: number;
  esEdicion = false;
  tiposHabitacion: TipoHabitacion[] = [];
  fechaMinima = this.fechaLocalActual();
  cargando = true;
  consultando = false;
  guardando = false;
  disponibilidadConsultada = false;
  cantidadDisponibles = 0;
  errorCarga = '';
  mensajeError = '';

  formulario = new FormGroup({
    tipoId: new FormControl('', [Validators.required]),
    fechaEntrada: new FormControl('', [Validators.required]),
    fechaSalida: new FormControl('', [Validators.required]),
    cantidadPersonas: new FormControl(2, [
      Validators.required,
      Validators.min(1),
      Validators.pattern(/^[0-9]+$/),
    ]),
  });

  ngOnInit(): void {
    // Escucha la navegación, incluida la reutilización de esta página entre nueva y editar.
    // Las peticiones HTTP dependientes se componen dentro de cargarFormulario con mergeMap.
    this.cambiosRuta = this.route.paramMap.subscribe(() => this.cargarFormulario());
  }

  ngOnDestroy(): void {
    this.cambiosRuta?.unsubscribe();
    this.carga?.unsubscribe();
    this.consulta?.unsubscribe();
    this.guardado?.unsubscribe();
  }

  cargarFormulario(): void {
    this.carga?.unsubscribe();
    this.consulta?.unsubscribe();
    this.guardado?.unsubscribe();
    this.clienteId = Number(this.route.snapshot.params['id']);
    const parametroReserva = this.route.snapshot.params['reservaId'];
    this.esEdicion = parametroReserva !== undefined;
    this.reservaId = this.esEdicion ? Number(parametroReserva) : undefined;
    this.cargando = true;
    this.consultando = false;
    this.guardando = false;
    this.errorCarga = '';
    this.mensajeError = '';
    this.tiposHabitacion = [];
    this.invalidarDisponibilidad();
    this.formulario.reset({ tipoId: '', fechaEntrada: '', fechaSalida: '', cantidadPersonas: 2 });

    if (
      !Number.isInteger(this.clienteId) ||
      this.clienteId < 1 ||
      (this.esEdicion &&
        (this.reservaId === undefined || !Number.isInteger(this.reservaId) || this.reservaId < 1))
    ) {
      this.errorCarga = 'La dirección no contiene identificadores válidos.';
      this.cargando = false;
      return;
    }

    this.carga = this.tipoHabitacionService
      .obtenerTodos()
      .pipe(
        mergeMap((tipos): Observable<Reserva | Cliente> => {
          this.tiposHabitacion = tipos;
          // El catálogo debe estar cargado antes de precargar el selector de edición.
          return this.reservaId !== undefined
            ? this.reservaService.obtenerParaEditar(this.clienteId, this.reservaId)
            : this.clienteService.buscarPorId(this.clienteId);
        }),
      )
      .subscribe({
        next: (datos) => {
          this.cargando = false;
          if ('fechaInicio' in datos) {
            const tipoId = datos.habitacion?.tipoHabitacion?.id;
            if (!this.tiposHabitacion.some((tipo) => tipo.id === tipoId)) {
              this.errorCarga = 'No fue posible recuperar el tipo de habitación de la reserva.';
              return;
            }
            this.formulario.patchValue({
              tipoId: String(tipoId),
              fechaEntrada: datos.fechaInicio,
              fechaSalida: datos.fechaFin,
              cantidadPersonas: datos.cantidadPersonas,
            });
          } else {
            const parametroTipo = this.route.snapshot.queryParams['tipoId'];
            if (parametroTipo !== undefined) {
              const tipoId = Number(parametroTipo);
              if (this.tiposHabitacion.some((tipo) => tipo.id === tipoId)) {
                this.formulario.patchValue({ tipoId: String(tipoId) });
              } else {
                this.mensajeError =
                  'El tipo solicitado no existe. Selecciona otro tipo de habitación.';
              }
            }
          }
        },
        error: (error: HttpErrorResponse) => {
          this.errorCarga = this.obtenerMensajeError(error);
          this.cargando = false;
        },
      });
  }

  invalidarDisponibilidad(): void {
    this.disponibilidadConsultada = false;
    this.cantidadDisponibles = 0;
    this.criteriosConsultados = '';
    this.mensajeError = '';
  }

  consultarDisponibilidad(): void {
    if (this.cargando || this.consultando || this.guardando || this.errorCarga) return;
    this.invalidarDisponibilidad();
    const datos = this.validarFormulario();
    if (!datos) return;
    const tipoId = Number(this.formulario.value.tipoId);
    this.consultando = true;
    this.consulta = this.reservaService
      .consultarDisponibilidad(this.clienteId, tipoId, datos, this.reservaId)
      .subscribe({
        next: (habitaciones) => {
          this.cantidadDisponibles = habitaciones.length;
          this.disponibilidadConsultada = true;
          this.criteriosConsultados = this.firmaCriterios(tipoId, datos);
          this.consultando = false;
        },
        error: (error: HttpErrorResponse) => {
          this.mensajeError = this.obtenerMensajeError(error);
          this.consultando = false;
        },
      });
  }

  confirmarReserva(): void {
    if (this.cargando || this.consultando || this.guardando || this.errorCarga) return;
    this.mensajeError = '';
    const datos = this.validarFormulario();
    if (!datos) return;
    const tipoId = Number(this.formulario.value.tipoId);
    if (
      !this.disponibilidadConsultada ||
      this.cantidadDisponibles < 1 ||
      this.criteriosConsultados !== this.firmaCriterios(tipoId, datos)
    ) {
      this.invalidarDisponibilidad();
      this.mensajeError =
        'Consulta la disponibilidad para los criterios actuales antes de guardar.';
      return;
    }
    this.guardando = true;
    const operacion =
      this.reservaId !== undefined
        ? this.reservaService.modificar(this.clienteId, this.reservaId, tipoId, datos)
        : this.reservaService.crear(this.clienteId, tipoId, datos);
    this.guardado = operacion.subscribe({
      next: (reserva) => {
        this.router.navigate(['/cliente', this.clienteId, 'reservas'], {
          queryParams: {
            resultado: this.esEdicion ? 'modificada' : 'creada',
            numero: reserva.numeroReserva,
          },
        });
      },
      error: (error: HttpErrorResponse) => {
        this.guardando = false;
        this.invalidarDisponibilidad();
        this.mensajeError = this.obtenerMensajeError(error);
      },
    });
  }

  private validarFormulario(): ReservaSolicitud | undefined {
    this.formulario.markAllAsTouched();
    const valores = this.formulario.value;
    const tipoId = Number(valores.tipoId);
    const tipo = this.tiposHabitacion.find((item) => item.id === tipoId);
    const cantidad = Number(valores.cantidadPersonas);
    if (this.formulario.invalid || !tipo || !Number.isInteger(cantidad) || cantidad < 1) {
      this.mensajeError =
        'Completa el tipo, las fechas y una cantidad entera de huéspedes mayor que cero.';
      return;
    }
    const entrada = valores.fechaEntrada ?? '';
    const salida = valores.fechaSalida ?? '';
    if (entrada < this.fechaMinima || salida <= entrada) {
      this.mensajeError =
        'La entrada no puede estar en el pasado y la salida debe ser posterior a la entrada.';
      return;
    }
    if (cantidad > tipo.capacidadPersonas) {
      this.mensajeError = `Este tipo de habitación admite hasta ${tipo.capacidadPersonas} personas.`;
      return;
    }
    return { fechaInicio: entrada, fechaFin: salida, cantidadPersonas: cantidad };
  }

  private firmaCriterios(tipoId: number, datos: ReservaSolicitud): string {
    return JSON.stringify([tipoId, datos.fechaInicio, datos.fechaFin, datos.cantidadPersonas]);
  }

  private obtenerMensajeError(error: HttpErrorResponse): string {
    const respuesta: unknown = error.error;
    if (
      respuesta !== null &&
      typeof respuesta === 'object' &&
      'mensaje' in respuesta &&
      typeof respuesta.mensaje === 'string'
    ) {
      return respuesta.mensaje;
    }
    return error.status === 0
      ? 'No fue posible conectar con el backend. Inténtalo nuevamente.'
      : 'No fue posible completar la operación de reserva.';
  }

  private fechaLocalActual(): string {
    const fecha = new Date();
    return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
  }
}
