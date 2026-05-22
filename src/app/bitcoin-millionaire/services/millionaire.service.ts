import { Injectable, signal, computed, effect } from '@angular/core';
import { CURRENCY_META } from '../data/currency-meta';

export type Sort = 'high' | 'low' | 'alpha';

export interface EnrichedCountry {
  name: string;
  code: string;
  symbol: string;
  flag: string;
  local: number;
  isMillionaire: boolean;
  mult: number;
}

const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

const COINGECKO_VS = [
  'usd', 'eur', 'jpy', 'gbp', 'aud', 'cad', 'chf', 'cny', 'hkd', 'idr',
  'inr', 'krw', 'mxn', 'myr', 'nok', 'nzd', 'php', 'pkr', 'pln', 'rub',
  'sek', 'sgd', 'thb', 'try', 'twd', 'zar', 'ars', 'bdt', 'bhd', 'bmd',
  'brl', 'clp', 'czk', 'dkk', 'huf', 'ils', 'kwd', 'lkr', 'ngn', 'sar',
  'uah', 'vnd', 'ves', 'gel', 'aed',
] as const;

const SEED_RATES: Record<string, number> = {
  USD: 1, EUR: 0.93, GBP: 0.79, CHF: 0.90, JPY: 155, CNY: 7.25,
  HKD: 7.83, SGD: 1.35, KRW: 1340, INR: 83, IDR: 15900, THB: 35,
  VND: 24500, PHP: 57, MYR: 4.7, PKR: 278, BDT: 110, AUD: 1.55,
  NZD: 1.65, CAD: 1.37, MXN: 17.2, BRL: 5.1, ARS: 875, CLP: 940,
  COP: 4000, PEN: 3.75, VES: 36, NOK: 10.8, SEK: 10.5, DKK: 6.95,
  ISK: 138, PLN: 4.0, CZK: 23.2, HUF: 365, UAH: 38, TRY: 32,
  RUB: 90, ILS: 3.7, AED: 3.67, SAR: 3.75, EGP: 48, ZAR: 18.5,
  NGN: 1450, KES: 130, LBP: 89500,
};

@Injectable({ providedIn: 'root' })
export class MillionaireService {
  btc = signal<number>(0.1);
  btcPrice = signal<number>(105_000);
  btcChanges = signal<Record<string, number>>({});
  sort = signal<Sort>('high');
  onlyMillionaire = signal<boolean>(false);
  view = signal<'list' | 'map'>('list');

  private usdRates = signal<Record<string, number>>(SEED_RATES);

  enriched = computed<EnrichedCountry[]>(() => {
    const rates = this.usdRates();
    const usdValue = this.btc() * this.btcPrice();
    return CURRENCY_META
      .filter(c => rates[c.code] != null)
      .map(c => {
        const local = usdValue * rates[c.code];
        return { name: c.name, code: c.code, symbol: c.symbol, flag: c.flag, local, isMillionaire: local >= 1_000_000, mult: local / 1_000_000 };
      });
  });

  totalCount = computed(() => this.enriched().length);

  millionaireCount = computed(() => this.enriched().filter(c => c.isMillionaire).length);

  filteredList = computed(() => {
    let list = this.enriched().filter(c => c.local > 0);
    if (this.onlyMillionaire()) list = list.filter(c => c.isMillionaire);
    const sort = this.sort();
    if (sort === 'alpha') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'high') {
      list.sort((a, b) => b.local - a.local);
    } else if (sort === 'low') {
      list.sort((a, b) => a.local - b.local);
    }
    return list;
  });

  usdValue = computed(() => this.btc() * this.btcPrice());

  topCountry = computed(() => {
    const sorted = [...this.enriched()].sort((a, b) => b.local - a.local);
    return sorted[0] ?? null;
  });

  constructor() {
    this.refresh();
    setInterval(() => this.refresh(), CACHE_TTL);
  }

  private refresh(): void {
    void Promise.allSettled([this.fetchBtcPrice(), this.fetchUsdRates()]);
  }

  private async fetchBtcPrice(): Promise<void> {
    const cached = localStorage.getItem('btcPriceCache');
    if (cached) {
      const { value, changes, ts } = JSON.parse(cached) as { value: number; changes?: Record<string, number>; ts: number };
      if (Date.now() - ts < CACHE_TTL) {
        this.btcPrice.set(value);
        if (changes) this.btcChanges.set(changes);
        return;
      }
    }
    try {
      const vs = COINGECKO_VS.join(',');
      const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=${vs}&include_24hr_change=true`);
      if (!res.ok) return;
      const data = await res.json() as { bitcoin?: Record<string, unknown> };
      const btcData = data?.['bitcoin'];
      if (typeof btcData?.['usd'] === 'number') {
        const value = btcData['usd'] as number;
        const changes: Record<string, number> = {};
        for (const [key, val] of Object.entries(btcData)) {
          if (key.endsWith('_24h_change') && typeof val === 'number') {
            const code = key.replace('_24h_change', '').toUpperCase();
            changes[code] = val;
          }
        }
        this.btcPrice.set(value);
        this.btcChanges.set(changes);
        localStorage.setItem('btcPriceCache', JSON.stringify({ value, changes, ts: Date.now() }));
      }
    } catch {
      /* keep existing value */
    }
  }

  private async fetchUsdRates(): Promise<void> {
    const cached = localStorage.getItem('usdRatesCache');
    if (cached) {
      const { value, ts } = JSON.parse(cached) as { value: Record<string, number>; ts: number };
      if (Date.now() - ts < CACHE_TTL) { this.usdRates.set(value); return; }
    }
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/USD');
      if (!res.ok) return;
      const data = await res.json() as { result?: string; rates?: Record<string, unknown> };
      if (data?.result === 'success' && data.rates) {
        const value: Record<string, number> = {};
        for (const [code, val] of Object.entries(data.rates)) {
          if (typeof val === 'number') value[code] = val;
        }
        this.usdRates.set(value);
        localStorage.setItem('usdRatesCache', JSON.stringify({ value, ts: Date.now() }));
      }
    } catch {
      /* keep seed rates */
    }
  }
}
