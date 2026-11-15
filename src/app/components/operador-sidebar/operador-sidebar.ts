import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-operador-sidebar',
  styleUrl: './operador-sidebar.scss',
  templateUrl: './operador-sidebar.html',
})
export class OperadorSidebar {}
