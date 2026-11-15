import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
import { NavbarCliente } from '../navbar-cliente/navbar-cliente';

@Component({
  imports: [RouterLink, NavbarCliente],
  selector: 'app-navbar',
  styleUrl: './navbar.scss',
  templateUrl: './navbar.html',
})
export class Navbar {
  private router = inject(Router);

  // clienteId viene en la query (?clienteId=1) cuando el cliente entra desde su portal.
  clienteId = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      startWith(null),
      map(() => Number(this.router.parseUrl(this.router.url).queryParams['clienteId'])),
      map((id) => (Number.isInteger(id) && id > 0 ? id : null)),
    ),
    { initialValue: null },
  );
}
