import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminSidebar } from '../../components/admin-sidebar/admin-sidebar';
import { Habitacion } from '../../models/habitacion.model';
import { TipoHabitacion } from '../../models/tipo-habitacion.model';
import { HabitacionService } from '../../services/habitacion.service';
import { TipoHabitacionService } from '../../services/tipo-habitacion.service';

@Component({
  imports: [ReactiveFormsModule, RouterLink, AdminSidebar],
  selector: 'app-admin-habitacion-form',
  styleUrl: './admin-habitacion-form.scss',
  templateUrl: './admin-habitacion-form.html',
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
    tipoHabitacionId: new FormControl<number | null>(null, [Validators.required]),
    nombre: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100),
    ]),
    etiqueta: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    numero: new FormControl('', [Validators.required, Validators.maxLength(10)]),
    piso: new FormControl<number | null>(1, [Validators.required, Validators.min(1)]),
    capacidad: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
    precio: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    estado: new FormControl('DISPONIBLE', [Validators.required]),
  });

  ngOnInit(): void {
    this.tiposHabitacion = this.tipoHabitacionService.obtenerTodos();
    const idParametro = this.route.snapshot.params['id'];

    if (idParametro !== undefined) {
      this.cargarHabitacion(Number(idParametro));
    }
  }

  actualizarDatosTipo(): void {
    const tipoId = this.habitacionForm.controls.tipoHabitacionId.value;
    const tipoHabitacion =
      tipoId === null ? undefined : this.tipoHabitacionService.obtenerPorId(tipoId);

    this.habitacionForm.patchValue({
      capacidad: tipoHabitacion?.capacidadPersonas ?? null,
      precio: tipoHabitacion?.precioNoche ?? null,
    });
  }

  guardar(): void {
    this.errorHabitacion = '';
    this.habitacionForm.markAllAsTouched();

    if (this.habitacionForm.invalid || !this.habitacionEncontrada) {
      return;
    }

    const valor = this.habitacionForm.getRawValue();

    if (
      valor.tipoHabitacionId === null ||
      valor.piso === null ||
      valor.capacidad === null ||
      valor.precio === null
    ) {
      return;
    }

    const habitacion: Habitacion = {
      id: this.habitacionId,
      tipoHabitacionId: valor.tipoHabitacionId,
      nombre: valor.nombre ?? '',
      etiqueta: valor.etiqueta ?? '',
      numero: valor.numero ?? '',
      piso: valor.piso,
      capacidad: valor.capacidad,
      precio: valor.precio,
      estado: valor.estado ?? 'DISPONIBLE',
    };

    try {
      if (this.esEdicion && this.habitacionId !== undefined) {
        this.habitacionService.actualizarHabitacion(this.habitacionId, habitacion);
      } else {
        this.habitacionService.agregarHabitacion(habitacion);
      }

      this.router.navigate(['/admin/habitaciones']);
    } catch (error: unknown) {
      this.errorHabitacion =
        error instanceof Error ? error.message : 'No fue posible guardar la habitación.';
    }
  }

  private cargarHabitacion(id: number): void {
    this.esEdicion = true;
    this.habitacionId = id;

    if (!Number.isInteger(id) || id < 1) {
      this.habitacionEncontrada = false;
      this.errorHabitacion = 'El identificador de la habitación no es válido.';
      return;
    }

    const habitacion = this.habitacionService.obtenerPorId(id);

    if (!habitacion) {
      this.habitacionEncontrada = false;
      this.errorHabitacion = `No se encontró la habitación con id ${id}.`;
      return;
    }

    this.habitacionForm.patchValue({
      tipoHabitacionId: habitacion.tipoHabitacionId,
      nombre: habitacion.nombre,
      etiqueta: habitacion.etiqueta ?? '',
      numero: habitacion.numero,
      piso: habitacion.piso ?? 1,
      capacidad: habitacion.capacidad,
      precio: habitacion.precio,
      estado: habitacion.estado,
    });
  }
}
