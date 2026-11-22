import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Promocion } from '../../../models/promocion.model';
import { PromocionService } from '../../../services/promocion.service';

@Component({
  selector: 'app-promociones', imports: [RouterLink, CommonModule], templateUrl: './promociones.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class Promociones implements OnInit {
  private service = inject(PromocionService);
  promociones: Promocion[] = [];
  ngOnInit(): void { this.service.publicas().subscribe({ next: (items) => this.promociones = items }); }
}
