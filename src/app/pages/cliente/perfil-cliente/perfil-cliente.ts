import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarCliente } from '../../../components/navbar-cliente/navbar-cliente';
import { Cliente } from '../../../models/cliente.model';
import { ClienteService } from '../../../services/cliente.service';
import { ToastService } from '../../../services/toast.service';
import { PerfilResumen } from './components/perfil-resumen/perfil-resumen';

@Component({
  selector: 'app-perfil-cliente',
  imports: [FormsModule, NavbarCliente, PerfilResumen],
  templateUrl: './perfil-cliente.html',
  styleUrl: './perfil-cliente.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class PerfilCliente implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private clienteService = inject(ClienteService);
  private toast = inject(ToastService);

  clienteId = 0;
  cliente?: Cliente;

  nombre = '';
  apellido = '';
  correo = '';
  telefono = '';

  contrasenaActual = '';
  nuevaContrasena = '';
  confirmarContrasena = '';
  errorPerfil = '';
  errorTelefono = '';
  errorPassword = '';
  errorActual = '';
  errorConfirmar = '';
  errorCuenta = '';

  // Carga el perfil indicado por la ruta y precarga los campos editables.
  ngOnInit(): void {
    this.clienteId = Number(this.route.snapshot.params['id']);
    this.clienteService.buscarPorId(this.clienteId).subscribe({
      next: (c) => {
        this.cliente = c;
        this.nombre = c.nombre;
        this.apellido = c.apellido;
        this.correo = c.correo;
        this.telefono = c.telefono;
      },
      error: (err) => {
        this.errorPerfil = err.error?.mensaje ?? 'No fue posible cargar el perfil.';
      },
    });
  }

  // Envía los cambios del perfil y sincroniza los campos con la respuesta del servidor.
  guardarDatos(): void {
    if (!this.cliente) {
      this.errorPerfil = 'No hay un perfil cargado para actualizar.';
      return;
    }

    this.errorPerfil = '';
    this.errorTelefono = '';
    // Solo dígitos, + opcional al inicio, entre 7 y 15 dígitos.
    if (!/^\+?\d{7,15}$/.test(this.telefono.trim())) {
      this.errorTelefono = 'El teléfono debe tener solo dígitos (con + opcional al inicio), entre 7 y 15.';
      return;
    }
    this.clienteService
      .actualizar({
        ...this.cliente,
        nombre: this.nombre,
        apellido: this.apellido,
        correo: this.correo,
        telefono: this.telefono.trim(),
      })
      .subscribe({
        next: (cliente) => {
          this.cliente = cliente;
          this.nombre = cliente.nombre;
          this.apellido = cliente.apellido;
          this.correo = cliente.correo;
          this.telefono = cliente.telefono;
          this.toast.mostrar('Tus datos se actualizaron correctamente.');
        },
        error: (err) => {
          this.errorPerfil = err.error?.mensaje ?? 'No fue posible actualizar el perfil.';
        },
      });
  }

  // Verifica que las contraseñas coincidan y solicita el cambio de contraseña.
  cambiarPassword(): void {
    this.errorPassword = '';
    this.errorActual = '';
    this.errorConfirmar = '';
    if (this.nuevaContrasena !== this.confirmarContrasena) {
      this.errorConfirmar = 'Las contraseñas no coinciden.';
      return;
    }

    this.clienteService
      .cambiarContrasena(
        this.clienteId,
        this.contrasenaActual,
        this.nuevaContrasena,
        this.confirmarContrasena,
      )
      .subscribe({
        next: () => {
          this.contrasenaActual = '';
          this.nuevaContrasena = '';
          this.confirmarContrasena = '';
          this.toast.mostrar('Tu contraseña se actualizó correctamente.');
        },
        error: (err) => {
          const mensaje: string = err.error?.mensaje ?? 'No fue posible cambiar la contraseña.';
          // El backend a veces responde "Correo o contraseña incorrectos": aquí es la contraseña actual.
          if (/correo/i.test(mensaje)) this.errorActual = 'La contraseña actual no es correcta.';
          else this.errorPassword = mensaje;
        },
      });
  }

  // Primer clic: muestra la confirmación en pantalla (la cuenta es irreversible)
  pidiendoEliminarCuenta = false;

  // Segundo clic: elimina la cuenta y vuelve al inicio si tiene éxito.
  eliminarCuenta(): void {
    this.pidiendoEliminarCuenta = false;
    this.errorCuenta = '';
    this.clienteService.eliminarCuenta(this.clienteId).subscribe({
      next: () => {
        this.toast.mostrar('Tu cuenta fue eliminada.');
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        this.errorCuenta = err.error?.mensaje ?? 'No fue posible eliminar la cuenta.';
      },
    });
  }
}
