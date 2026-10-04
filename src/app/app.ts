import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { Footer } from './components/footer/footer';

@Component({
  imports: [RouterOutlet, Navbar, Footer],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  private router = inject(Router);

  mostrarLayoutGlobal = !this.esRutaOperador();

  title = 'hotel-macondo-frontend';

  actualizarLayoutGlobal(): void {
    this.mostrarLayoutGlobal = !this.esRutaOperador();
  }

  private esRutaOperador(): boolean {
    return this.router.url.startsWith('/operador');
  }
}
