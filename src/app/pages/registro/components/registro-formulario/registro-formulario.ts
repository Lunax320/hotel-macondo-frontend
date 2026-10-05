import { Component, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Cliente } from '../../../../models/cliente.model';
import { AlertaMensaje } from '../../../../components/alerta-mensaje/alerta-mensaje';
import { RegistroDatosPersonales } from '../registro-datos-personales/registro-datos-personales';
import { RegistroCredenciales } from '../registro-credenciales/registro-credenciales';

// Datos que el formulario de registro le entrega a la página.
export interface DatosRegistro {
  cliente: Cliente;
  contrasena: string;
  confirmarContrasena: string;
}

// Tarjeta del registro: arma el formulario y emite los datos; la página decide si se puede registrar.
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
  registrado = output<DatosRegistro>();

  formulario = new FormGroup({
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
    correo: new FormControl('', [Validators.required, Validators.email]),
    contrasena: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmarContrasena: new FormControl('', [Validators.required]),
  });

  enviar(): void {
    if (this.formulario.invalid) {
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
      confirmarContrasena: valor.confirmarContrasena ?? '',
    });
  }
}
