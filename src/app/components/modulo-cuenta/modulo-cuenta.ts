import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
  selector: 'app-modulo-cuenta',
  templateUrl: './modulo-cuenta.html',
})
export class ModuloCuenta {
  private router = inject(Router);

  habitacionId = '';

  buscarCuenta(): void {
    const id = this.habitacionId.trim();
    if (/^\d+$/.test(id)) {
      this.router.navigate(['/operador/cuenta', id]);
    }
  }
}
