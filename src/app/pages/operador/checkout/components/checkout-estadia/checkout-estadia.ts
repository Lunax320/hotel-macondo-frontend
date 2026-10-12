import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-checkout-estadia',
  templateUrl: './checkout-estadia.html',
})
export class CheckoutEstadia {
  @Input({ required: true }) habitacionId = '';
}
