import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminSidebar } from '../../components/admin-sidebar/admin-sidebar';
import { Habitacion } from '../../models/habitacion.model';
import { TipoHabitacion } from '../../models/tipo-habitacion.model';
import { HabitacionService } from '../../services/habitacion.service';
import { TipoHabitacionService } from '../../services/tipo-habitacion.service';
import { HabitacionCamposBasicos } from './components/habitacion-campos-basicos/habitacion-campos-basicos';
import { HabitacionCamposDetalle } from './components/habitacion-campos-detalle/habitacion-campos-detalle';
import { BotonesFormularioHabitacion } from './components/botones-formulario-habitacion/botones-formulario-habitacion';

// Pagina admin para crear o editar una habitacion (via API).
@Component({
  imports: [
    ReactiveFormsModule,
    RouterLink,
    AdminSidebar,
    HabitacionCamposBasicos,
    HabitacionCamposDetalle,
    BotonesFormularioHabitacion,
  ],
  selector: 'app-admin-habitacion-form',
  styleUrl: './admin-habitacion-form.scss',
  templateUrl: './admin-habitacion-form.html',
  // Angular 22 usa OnPush por defecto; Eager actualiza la vista cuando responde el backend.
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class AdminHabitacionForm implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private habitacionService = inject(HabitacionService);
  private tipoHabitacionService = inject(TipoHabitacionService);

  tiposHabitacion: TipoHabitacion[] = [];
  habitacionId?: number;
  esEdicion = false;
  habitacionEncontrada = true;
  errorHabitacion = '';

  habitacionForm = new FormGroup({
    tipoHabitacion: new FormControl('', [Validators.required]),
    nombre: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100),
    ]),
    etiqueta: new FormControl('', [Validators.maxLength(100)]),
    numero: new FormControl('', [Validators.required, Validators.maxLength(10)]),
    piso: new FormControl<number | null>(1, [Validators.required, Validators.min(1)]),
    capacidad: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
    precio: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    estado: new FormControl('DISPONIBLE', [Validators.required]),
  });

  // Inicializa el componente cargando tipos y, si aplica, la habitación a editar.
  ngOnInit(): void {
    this.tipoHabitacionService.listarTipos().subscribe({
      next: (tipos) => (this.tiposHabitacion = tipos),
      error: (error) =>
        (this.errorHabitacion =
          error.error?.mensaje ?? 'No fue posible cargar los tipos de habitación.'),
    });
    const idParametro = this.route.snapshot.params['id'];

    if (idParametro !== undefined) {
      this.cargarHabitacion(Number(idParametro));
    }
  }

  // Actualiza capacidad y precio según el tipo seleccionado.
  actualizarDatosTipo(): void {
    const tipoId = Number(this.habitacionForm.controls.tipoHabitacion.value);
    const tipoHabitacion = this.tiposHabitacion.find((tipo) => tipo.id === tipoId);

    this.habitacionForm.patchValue({
      capacidad: tipoHabitacion?.capacidadPersonas ?? null,
      precio: tipoHabitacion?.precioNoche ?? null,
    });
  }

  // Valida y guarda la habitación.
  guardar(): void {
    this.errorHabitacion = '';
    this.habitacionForm.markAllAsTouched();

    if (this.habitacionForm.invalid || !this.habitacionEncontrada) {
      return;
    }

    const valor = this.habitacionForm.getRawValue();

    if (
      valor.tipoHabitacion === null ||
      valor.tipoHabitacion === '' ||
      valor.piso === null ||
      valor.capacidad === null ||
      valor.precio === null
    ) {
      return;
    }

    const tipoHabitacion = this.tiposHabitacion.find(
      (tipo) => tipo.id === Number(valor.tipoHabitacion),
    );

    if (!tipoHabitacion) {
      this.errorHabitacion = 'El tipo de habitación no existe.';
      return;
    }

    const habitacion: Habitacion = {
      id: this.habitacionId,
      tipoHabitacion,
      nombre: valor.nombre?.trim() ?? '',
      etiqueta: valor.etiqueta?.trim() ?? '',
      numero: valor.numero?.trim() ?? '',
      piso: valor.piso,
      capacidad: valor.capacidad,
      precio: valor.precio,
      estado: valor.estado ?? 'DISPONIBLE',
    };

    const guardado = this.esEdicion
      ? this.habitacionService.actualizarHabitacion(habitacion)
      : this.habitacionService.agregarHabitacion(habitacion);

    guardado.subscribe({
      next: () => this.router.navigate(['/admin/habitaciones']),
      error: (error) =>
        (this.errorHabitacion = error.error?.mensaje ?? 'No fue posible guardar la habitación.'),
    });
  }

  // Carga una habitación para editarla.
  private cargarHabitacion(id: number): void {
    this.esEdicion = true;
    this.habitacionId = id;

    if (!Number.isInteger(id) || id < 1) {
      this.habitacionEncontrada = false;
      this.errorHabitacion = 'El identificador de la habitación no es válido.';
      return;
    }

    this.habitacionService.buscarHabitacionPorId(id).subscribe({
      next: (habitacion) =>
        this.habitacionForm.patchValue({
          tipoHabitacion: habitacion.tipoHabitacion.id?.toString() ?? '',
          nombre: habitacion.nombre,
          etiqueta: habitacion.etiqueta ?? '',
          numero: habitacion.numero,
          piso: habitacion.piso ?? 1,
          capacidad: habitacion.capacidad,
          precio: habitacion.precio,
          estado: habitacion.estado,
        }),
      error: (error) => {
        this.habitacionEncontrada = false;
        this.errorHabitacion = error.error?.mensaje ?? `No se encontró la habitación con id ${id}.`;
      },
    });
  }
}
