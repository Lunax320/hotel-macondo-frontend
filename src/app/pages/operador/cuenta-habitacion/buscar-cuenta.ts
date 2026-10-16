import { Component } from '@angular/core';
import { OperadorSidebar } from '../../../components/operador-sidebar/operador-sidebar';
import { ModuloCuenta } from '../components/modulo-cuenta/modulo-cuenta';

@Component({
  imports: [ModuloCuenta, OperadorSidebar],
  selector: 'app-operador-buscar-cuenta',
  templateUrl: './buscar-cuenta.html',
})
export class OperadorBuscarCuenta {}
