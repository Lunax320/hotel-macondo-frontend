import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { NavbarCliente } from '../navbar-cliente/navbar-cliente';

@Component({
  imports: [RouterLink, NavbarCliente],
  selector: 'app-navbar',
  styleUrl: './navbar.scss',
  templateUrl: './navbar.html',
})
export class Navbar implements OnInit, OnDestroy {
  private router = inject(Router);
  private navegacion?: Subscription;

  // clienteId viene en la query (?clienteId=1) cuando el cliente entra desde su portal.
  clienteId: number | null = null;

  ngOnInit(): void {
    this.leerClienteId();
    // Cada vez que cambia la página se vuelve a leer la query.
    this.navegacion = this.router.events
      .pipe(filter((evento) => evento instanceof NavigationEnd))
      .subscribe(() => this.leerClienteId());
  }

  ngOnDestroy(): void {
    this.navegacion?.unsubscribe();
  }

  private leerClienteId(): void {
    const id = Number(this.router.parseUrl(this.router.url).queryParams['clienteId']);
    this.clienteId = Number.isInteger(id) && id > 0 ? id : null;
  }
}
