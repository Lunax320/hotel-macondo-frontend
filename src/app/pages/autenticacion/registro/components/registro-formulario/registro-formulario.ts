import { Component, input, output, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DatosRegistro } from '../../../../../models/datos-registro.model';
import { AlertaMensaje } from '../../../../../components/alerta-mensaje/alerta-mensaje';
import { RegistroDatosPersonales } from '../registro-datos-personales/registro-datos-personales';
import { RegistroCredenciales } from '../registro-credenciales/registro-credenciales';

// Expresion regular para validar la estructura con arroba y dominio (.com, .co, etc.)
const EMAIL_REGEX = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

function contrasenasIguales(control: AbstractControl): ValidationErrors | null {
  return control.get('contrasena')?.value === control.get('confirmarContrasena')?.value
    ? null
    : { contrasenasDistintas: true };
}

@Component({
  selector: 'app-registro-formulario',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    AlertaMensaje,
    RegistroDatosPersonales,
    RegistroCredenciales,
  ],
  templateUrl: './registro-formulario.html',
  styleUrl: './registro-formulario.scss',
})
export class RegistroFormulario {
  mensajeError = input('');
  errorLocal = signal('');
  registrado = output<DatosRegistro>();

  formulario = new FormGroup(
    {
      nombre: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
      ]),
      apellido: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
      ]),
      cedula: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9]+$/),
        Validators.maxLength(20),
      ]),
      telefono: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9]+$/),
        Validators.minLength(7),
        Validators.maxLength(20),
      ]),
      correo: new FormControl('', [
        Validators.required,
        Validators.pattern(EMAIL_REGEX),
      ]),
      contrasena: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmarContrasena: new FormControl('', [Validators.required]),
    },
    { validators: contrasenasIguales },
  );

  enviar(): void {
    this.errorLocal.set('');

    const controlCorreo = this.formulario.get('correo');
    if (controlCorreo?.hasError('pattern') || controlCorreo?.hasError('required')) {
      this.errorLocal.set('El formato del correo electrónico no es válido.');
      return;
    }

    if (this.formulario.invalid) {
      this.errorLocal.set('Por favor completa todos los campos correctamente.');
      return;
    }

    const valor = this.formulario.value;

    this.registrado.emit({
      cliente: {
        nombre: valor.nombre ?? '',
        apellido: valor.apellido ?? '',
        cedula: valor.cedula ?? '',
        telefono: valor.telefono ?? '',
        correo: valor.correo ?? '',
      },
      contrasena: valor.contrasena ?? '',
    });
  }
}