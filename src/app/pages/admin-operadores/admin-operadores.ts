import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { switchMap } from 'rxjs';
import { AdminSidebar } from '../../components/admin-sidebar/admin-sidebar';
import { Operador } from '../../models/operador.model';
import { OperadorService } from '../../services/operador.service';
import { OperadorFormulario } from './components/operador-formulario/operador-formulario';
import { OperadorTabla } from './components/operador-tabla/operador-tabla';

// Administra el personal habilitado para operar el hotel.
@Component({
  imports: [ReactiveFormsModule, AdminSidebar, OperadorFormulario, OperadorTabla],
  selector: 'app-admin-operadores',
  templateUrl: './admin-operadores.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class AdminOperadores implements OnInit {
  private operadorService = inject(OperadorService);

  operadores: Operador[] = [];
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

    this.errorOperador = '';
    this.operadorService
      .agregar({ nombre, activo: true })
      .pipe(switchMap(() => this.operadorService.listar()))
      .subscribe({
        next: (lista) => {
          this.operadores = lista;
          this.operadorForm.reset();
        },
        error: (error) => {
          this.errorOperador = error.error?.mensaje ?? 'No fue posible agregar el operador.';
        },
      });
  }

  // Alterna el estado del operador y recarga la lista.
  cambiarEstado(id: number | undefined): void {
    if (id === undefined) {
      return;
    }

    this.errorOperador = '';
    this.operadorService
      .cambiarEstado(id)
      .pipe(switchMap(() => this.operadorService.listar()))
      .subscribe({
        next: (lista) => {
          this.operadores = lista;
        },
        error: (error) => {
          this.errorOperador = error.error?.mensaje ?? 'No fue posible cambiar el estado.';
        },
      });
  }

  // Elimina un operador y recarga la lista.
  eliminar(id: number | undefined): void {
    if (id === undefined) {
      return;
    }

    this.errorOperador = '';
    this.operadorService
      .eliminar(id)
      .pipe(switchMap(() => this.operadorService.listar()))
      .subscribe({
        next: (lista) => {
          this.operadores = lista;
        },
        error: (error) => {
          this.errorOperador = error.error?.mensaje ?? 'No fue posible eliminar el operador.';
        },
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
