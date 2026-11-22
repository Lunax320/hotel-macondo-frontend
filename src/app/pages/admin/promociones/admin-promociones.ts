import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Promocion } from '../../../models/promocion.model';
import { PromocionService } from '../../../services/promocion.service';
import { ToastService } from '../../../services/toast.service';
import { AdminSidebar } from '../../../components/admin-sidebar/admin-sidebar';

@Component({ selector: 'app-admin-promociones', imports: [FormsModule, AdminSidebar, CommonModule], templateUrl: './admin-promociones.html', changeDetection: ChangeDetectionStrategy.Eager })
export class AdminPromociones implements OnInit {
  private service = inject(PromocionService);
  private toast = inject(ToastService);
  promociones: Promocion[] = [];
  formulario: Promocion = this.nueva();
  error = '';
  ngOnInit(): void { this.cargar(); }
  nueva(): Promocion {
    const hoy = new Date().toISOString().slice(0, 10);
    return { codigo: '', nombre: '', descripcion: '', tipoDescuento: 'PORCENTAJE', valorDescuento: 10, fechaInicio: hoy, fechaFin: hoy, nochesMinimas: 1, activa: true };
  }
  editar(p: Promocion): void { this.formulario = { ...p }; }
  limpiar(): void { this.formulario = this.nueva(); }
  guardar(): void {
    this.service.guardar({ ...this.formulario }).subscribe({ next: () => { this.toast.mostrar('Promoción guardada.'); this.limpiar(); this.cargar(); }, error: e => this.error = e.error?.mensaje ?? 'No fue posible guardar la promoción.' });
  }
  eliminar(p: Promocion): void {
    if (p.id === undefined || !confirm(`¿Eliminar la promoción ${p.codigo}?`)) return;
    this.service.eliminar(p.id).subscribe({ next: () => { this.toast.mostrar('Promoción eliminada.'); this.cargar(); }, error: () => this.toast.mostrar('No fue posible eliminar la promoción.', 'error') });
  }
  private cargar(): void { this.service.todas().subscribe({ next: p => this.promociones = p, error: () => this.error = 'No fue posible cargar las promociones.' }); }
}
