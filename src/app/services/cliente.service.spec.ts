import { TestBed } from '@angular/core/testing';
import { ClienteService } from './cliente.service';

describe('ClienteService', () => {
  let clienteService: ClienteService;

  beforeEach(() => {
    clienteService = TestBed.inject(ClienteService);
  });

  it('existeCedula detecta una cédula ya registrada', () => {
    expect(clienteService.existeCedula('101')).toBe(true);
    expect(clienteService.existeCedula(' 101 ')).toBe(true);
    expect(clienteService.existeCedula('999999')).toBe(false);
  });
});
