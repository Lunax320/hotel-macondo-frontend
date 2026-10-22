import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarCliente } from '../../../components/navbar-cliente/navbar-cliente';
import { Cliente } from '../../../models/cliente.model';
import { ClienteService } from '../../../services/cliente.service';
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
  mensajePerfil = '';
  errorPassword = '';
  mensajePassword = '';
  errorCuenta = '';

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

  guardarDatos(): void {
    if (!this.cliente) {
      this.errorPerfil = 'No hay un perfil cargado para actualizar.';
      return;
    }

    this.errorPerfil = '';
    this.mensajePerfil = '';
    this.clienteService
      .actualizar({
        ...this.cliente,
        nombre: this.nombre,
        apellido: this.apellido,
        correo: this.correo,
        telefono: this.telefono,
      })
      .subscribe({
        next: (cliente) => {
          this.cliente = cliente;
          this.nombre = cliente.nombre;
          this.apellido = cliente.apellido;
          this.correo = cliente.correo;
          this.telefono = cliente.telefono;
          this.mensajePerfil = 'Los datos del perfil se actualizaron correctamente.';
        },
        error: (err) => {
          this.errorPerfil = err.error?.mensaje ?? 'No fue posible actualizar el perfil.';
        },
      });
  }

  cambiarPassword(): void {
    if (this.nuevaContrasena !== this.confirmarContrasena) {
      this.errorPassword = 'Las contraseñas no coinciden.';
      return;
    }

    this.errorPassword = '';
    this.mensajePassword = '';
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
          this.mensajePassword = 'La contraseña se actualizó correctamente.';
        },
        error: (err) => {
          this.errorPassword = err.error?.mensaje ?? 'No fue posible cambiar la contraseña.';
        },
      });
  }

  eliminarCuenta(): void {
    if (confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción es irreversible.')) {
      this.errorCuenta = '';
      this.clienteService.eliminarCuenta(this.clienteId).subscribe({
        next: () => this.router.navigateByUrl('/'),
        error: (err) => {
          this.errorCuenta = err.error?.mensaje ?? 'No fue posible eliminar la cuenta.';
        },
      });
    }
  }
}
