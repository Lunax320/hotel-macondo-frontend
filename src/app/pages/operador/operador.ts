import { Component } from '@angular/core';
import { OperadorSidebar } from '../../components/operador-sidebar/operador-sidebar';
import { OperadorModulos } from './components/operador-modulos/operador-modulos';

@Component({
  imports: [OperadorSidebar, OperadorModulos],
  selector: 'app-operador',
  styleUrl: './operador.scss',
  templateUrl: './operador.html',
})
export class Operador {}
