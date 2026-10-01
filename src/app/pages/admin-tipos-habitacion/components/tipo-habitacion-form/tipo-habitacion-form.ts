import { Component, input, OnInit, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TipoHabitacion } from '../../../../models/tipo-habitacion.model';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-tipo-habitacion-form',
  styleUrl: './tipo-habitacion-form.scss',
  templateUrl: './tipo-habitacion-form.html',
})
export class TipoHabitacionForm implements OnInit {
  tipoHabitacion = input<TipoHabitacion>();
  guardado = output<TipoHabitacion>();
  cancelado = output<void>();

  tipoHabitacionForm = new FormGroup({
    nombre: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100),
    ]),
    descripcion: new FormControl('', [Validators.required, Validators.maxLength(500)]),
    imagen: new FormControl('', [Validators.required]),
    capacidadPersonas: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1),
      Validators.max(10),
    ]),
    precioNoche: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
  });

  ngOnInit(): void {
    const tipoHabitacion = this.tipoHabitacion();

    if (tipoHabitacion) {
      this.tipoHabitacionForm.patchValue({
        nombre: tipoHabitacion.nombre,
        descripcion: tipoHabitacion.descripcion,
        imagen: tipoHabitacion.imagen ?? '',
        capacidadPersonas: tipoHabitacion.capacidadPersonas,
        precioNoche: tipoHabitacion.precioNoche,
      });
    }
  }

  guardar(): void {
    this.tipoHabitacionForm.markAllAsTouched();

    if (this.tipoHabitacionForm.invalid) {
      return;
    }

    const valor = this.tipoHabitacionForm.getRawValue();

    if (valor.capacidadPersonas === null || valor.precioNoche === null) {
      return;
    }

    this.guardado.emit({
      id: this.tipoHabitacion()?.id,
      nombre: valor.nombre?.trim() ?? '',
      descripcion: valor.descripcion?.trim() ?? '',
      imagen: valor.imagen?.trim() ?? '',
      capacidadPersonas: valor.capacidadPersonas,
      precioNoche: valor.precioNoche,
    });
  }

  cancelar(): void {
    this.cancelado.emit();
  }
}
