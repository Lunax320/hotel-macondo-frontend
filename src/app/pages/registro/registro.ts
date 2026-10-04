import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { ClienteService } from '../../services/cliente.service';
import { UsuarioService } from '../../services/usuario.service';
import { RegistroPresentacion } from './components/registro-presentacion/registro-presentacion';
import {
  DatosRegistro,
  RegistroFormulario,
} from './components/registro-formulario/registro-formulario';

// Página de registro: valida que la cuenta se pueda crear, guarda cliente + usuario y abre su portal.
@Component({
  selector: 'app-registro',
  imports: [RegistroPresentacion, RegistroFormulario],
  templateUrl: './registro.html',
  styleUrl: './registro.scss',
})
export class Registro {
  private clienteService = inject(ClienteService);
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);

  mensajeError = '';

  registrar(datos: DatosRegistro): void {
    // Cada intento empieza limpio para no dejar avisos viejos en pantalla.
    this.mensajeError = '';
    const cliente = { ...datos.cliente, correo: datos.cliente.correo.trim().toLowerCase() };

    if (datos.contrasena !== datos.confirmarContrasena) {
      this.mensajeError = 'Las contraseñas no coinciden.';
      return;
    }

    // Se revisan los dos datos únicos para avisar de una vez todo lo que está repetido.
    const repetidos: string[] = [];

    if (this.usuarioService.existeCorreo(cliente.correo)) {
      repetidos.push('Ya existe una cuenta con ese correo.');
    }

    if (this.clienteService.existeCedula(cliente.cedula)) {
      repetidos.push('Ya existe una cuenta con esa cédula.');
    }

    if (repetidos.length > 0) {
      this.mensajeError = repetidos.join(' ');
      return;
    }

    // Primero se guarda el cliente y con su id se crea el usuario (un solo subscribe).
    this.clienteService
      .agregarCliente(cliente)
      .pipe(
        switchMap((clienteGuardado) =>
          this.usuarioService.registrarCliente(clienteGuardado, datos.contrasena),
        ),
      )
      .subscribe((usuario) => {
        if (usuario?.cliente?.id) {
          this.router.navigate(['/cliente', usuario.cliente.id]);
        } else {
          this.mensajeError = 'No fue posible crear la cuenta. Intenta de nuevo.';
        }
      });
  }
}
