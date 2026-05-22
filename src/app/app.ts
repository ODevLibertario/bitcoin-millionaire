import { Component } from '@angular/core';
import { BitcoinMillionaireComponent } from './bitcoin-millionaire/bitcoin-millionaire.component';

@Component({
  selector: 'app-root',
  imports: [BitcoinMillionaireComponent],
  template: `<app-bitcoin-millionaire />`,
})
export class App {}
