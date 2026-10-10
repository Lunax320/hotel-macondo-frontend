import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { Footer } from './components/footer/footer';

// Componente raiz: navbar y footer globales alrededor del router-outlet.
@Component({
  imports: [RouterOutlet, Navbar, Footer],
  selector: 'app-root',
  styleUrl: './app.scss',
  // Angular 22 usa OnPush por defecto; Eager actualiza la vista cuando responde el backend.
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './app.html',
})
export class App {
  private router = inject(Router);
  protected mostrarNavbar = true;
  protected mostrarFooter = true;

  // Se llama al cambiar de ruta: oculta navbar/footer en las secciones con menu propio.
  actualizarLayoutGlobal(): void {
    const url = this.router.url;
    this.mostrarNavbar =
      !url.startsWith('/cliente') && !url.startsWith('/admin') && !url.startsWith('/operador');
    this.mostrarFooter = !url.startsWith('/admin') && !url.startsWith('/operador');
  }
}
