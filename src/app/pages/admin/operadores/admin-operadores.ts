import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { switchMap } from 'rxjs';
import { AdminSidebar } from '../../../components/admin-sidebar/admin-sidebar';
import { ConfirmacionAccion } from '../../../components/confirmacion-accion/confirmacion-accion';
import { Operador } from '../../../models/operador.model';
import { OperadorService } from '../../../services/operador.service';
import { ToastService } from '../../../services/toast.service';
import { OperadorFormulario } from './components/operador-formulario/operador-formulario';
import { OperadorTabla } from './components/operador-tabla/operador-tabla';

// Administra el personal habilitado para operar el hotel.
@Component({
  imports: [ConfirmacionAccion, ReactiveFormsModule, AdminSidebar, OperadorFormulario, OperadorTabla],
  selector: 'app-admin-operadores',
  templateUrl: './admin-operadores.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class AdminOperadores implements OnInit {
  private operadorService = inject(OperadorService);
  private toast = inject(ToastService);

  operadores: Operador[] = [];
  operadorPendiente?: Operador;
  errorOperador = '';
  operadorForm = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.maxLength(100)]),
  });

  // Inicializa el componente cargando la lista de operadores.
  ngOnInit(): void {
    this.cargarOperadores();
  }

  // Agrega un operador y recarga la lista.
  agregar(): void {
    this.operadorForm.markAllAsTouched();

    if (this.operadorForm.invalid) {
      return;
    }

    const nombre = this.operadorForm.controls.nombre.value?.trim() ?? '';

    if (nombre === '') {
      return;
    }

    this.operadorService
      .agregar({ nombre, activo: true })
      .pipe(switchMap(() => this.operadorService.listar()))
      .subscribe({
        next: (lista) => {
          this.operadores = lista;
          this.operadorForm.reset();
          this.toast.mostrar(`Operador ${nombre} agregado.`);
        },
        error: (error) =>
          this.toast.mostrar(error.error?.mensaje ?? 'No fue posible agregar el operador.', 'error'),
      });
  }

  // Pide confirmación antes de alternar el estado del operador.
  cambiarEstado(id: number | undefined): void {
    this.operadorPendiente = this.operadores.find((operador) => operador.id === id);
  }

  // Cancela el cambio de estado pendiente.
  cancelarEstado(): void {
    this.operadorPendiente = undefined;
  }

  // Alterna el estado del operador confirmado y recarga la lista.
  confirmarEstado(): void {
    const operador = this.operadorPendiente;

    if (operador?.id === undefined) {
      return;
    }

    this.operadorPendiente = undefined;
    this.operadorService
      .cambiarEstado(operador.id)
      .pipe(switchMap(() => this.operadorService.listar()))
      .subscribe({
        next: (lista) => {
          this.operadores = lista;
          this.toast.mostrar(
            `Operador ${operador.nombre} ${operador.activo ? 'desactivado' : 'activado'}.`,
          );
        },
        error: (error) =>
          this.toast.mostrar(error.error?.mensaje ?? 'No fue posible cambiar el estado.', 'error'),
      });
  }

  // Elimina un operador y recarga la lista.
  eliminar(id: number | undefined): void {
    const operador = this.operadores.find((o) => o.id === id);

    if (id === undefined) {
      return;
    }

    this.operadorService
      .eliminar(id)
      .pipe(switchMap(() => this.operadorService.listar()))
      .subscribe({
        next: (lista) => {
          this.operadores = lista;
          this.toast.mostrar(`Operador ${operador?.nombre} eliminado.`);
        },
        error: (error) =>
          this.toast.mostrar(error.error?.mensaje ?? 'No fue posible eliminar el operador.', 'error'),
      });
  }

  // Solicita la lista de operadores al backend.
  private cargarOperadores(): void {
    this.operadorService.listar().subscribe({
      next: (lista) => {
        this.operadores = lista;
      },
      error: (error) => {
        this.errorOperador = error.error?.mensaje ?? 'No fue posible cargar los operadores.';
      },
    });
  }
}
