import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarCliente } from '../../components/navbar-cliente/navbar-cliente';
import { Cliente } from '../../models/cliente.model';
import { ClienteService } from '../../services/cliente.service';
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
      error: (err) => console.error('Error al cargar perfil:', err),
    });
  }

  guardarDatos(): void {
    alert('Cambios guardados visualmente (esperando integración final del CRUD de cliente por tu compañero).');
  }

  cambiarPassword(): void {
    if (this.nuevaContrasena !== this.confirmarContrasena) {
      alert('Las contraseñas no coinciden.');
      return;
    }
    alert('Contraseña actualizada correctamente.');
    this.contrasenaActual = '';
    this.nuevaContrasena = '';
    this.confirmarContrasena = '';
  }

  eliminarCuenta(): void {
    if (confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción es irreversible.')) {
      alert('Cuenta marcada para eliminación.');
    }
  }
}