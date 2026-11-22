import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { Navbar } from './components/navbar/navbar';
import { Footer } from './components/footer/footer';
import { Toast } from './components/toast/toast';
import { ToastService } from './services/toast.service';

// Componente raiz: navbar y footer globales alrededor del router-outlet.
@Component({
  imports: [RouterOutlet, Navbar, Footer, Toast],
  selector: 'app-root',
  styleUrl: './app.scss',
  // Angular 22 usa OnPush por defecto; Eager actualiza la vista cuando responde el backend.
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './app.html',
})
export class App {
  private router = inject(Router);
  private toast = inject(ToastService);
  protected mostrarNavbar = true;
  protected mostrarFooter = true;

  constructor() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      const queryParams = this.router.parseUrl(this.router.url).queryParams;
      if (queryParams['correoVerificado'] === 'true') {
        this.toast.mostrar('Correo verificado. Ya puedes iniciar sesión.');
        void this.router.navigateByUrl('/', { replaceUrl: true });
      }
    });
  }

  // Se llama al cambiar de ruta: oculta navbar/footer en las secciones con menu propio.
  actualizarLayoutGlobal(): void {
    const url = this.router.url;
    this.mostrarNavbar =
      !url.startsWith('/cliente') && !url.startsWith('/admin') && !url.startsWith('/operador');
    // El recorrido 360 va a pantalla completa: sin footer.
    this.mostrarFooter =
      !url.startsWith('/admin') && !url.startsWith('/operador') && !url.startsWith('/explorar');
  }
}
