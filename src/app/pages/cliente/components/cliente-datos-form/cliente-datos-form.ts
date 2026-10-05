import { Component, OnInit, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Cliente } from '../../../../models/cliente.model';
import { AlertaMensaje } from '../../../../components/alerta-mensaje/alerta-mensaje';
import {
  CampoFormulario,
  ErrorCampo,
} from '../../../../components/campo-formulario/campo-formulario';

// Edita los datos personales del cliente. La cédula y el correo (usuario de inicio de sesión)
// se muestran deshabilitados porque no se cambian desde aquí.
@Component({
  selector: 'app-cliente-datos-form',
  imports: [ReactiveFormsModule, AlertaMensaje, CampoFormulario],
  templateUrl: './cliente-datos-form.html',
  styleUrl: './cliente-datos-form.scss',
})
export class ClienteDatosForm implements OnInit {
  // Mensajes que se muestran según el error de cada campo.
  erroresNombre: ErrorCampo[] = [
    { clave: 'required', mensaje: 'El nombre es obligatorio.' },
    { clave: 'minlength', mensaje: 'El nombre debe tener al menos 2 letras.' },
  ];
  erroresApellido: ErrorCampo[] = [
    { clave: 'required', mensaje: 'El apellido es obligatorio.' },
    { clave: 'minlength', mensaje: 'El apellido debe tener al menos 2 letras.' },
  ];
  erroresTelefono: ErrorCampo[] = [
    { clave: 'required', mensaje: 'El teléfono es obligatorio.' },
    { clave: 'pattern', mensaje: 'El teléfono debe contener solo dígitos.' },
    { clave: 'minlength', mensaje: 'Ingresa al menos 7 dígitos.' },
  ];

  cliente = input.required<Cliente>();
  mensajeExito = input('');
  guardado = output<Cliente>();

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
    telefono: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[0-9]+$/),
      Validators.minLength(7),
      Validators.maxLength(20),
    ]),
    cedula: new FormControl({ value: '', disabled: true }),
    correo: new FormControl({ value: '', disabled: true }),
  });

  ngOnInit(): void {
    this.formulario.patchValue(this.cliente());
  }

  // .value no incluye los campos deshabilitados: se toman del cliente original.
  guardar(): void {
    if (this.formulario.invalid) {
      return;
    }

    const valor = this.formulario.value;
    this.guardado.emit({
      ...this.cliente(),
      nombre: valor.nombre ?? '',
      apellido: valor.apellido ?? '',
      telefono: valor.telefono ?? '',
    });
    this.formulario.markAsPristine();
  }
}
