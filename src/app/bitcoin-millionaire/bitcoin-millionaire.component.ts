import {
  Component, ChangeDetectionStrategy, signal, computed,
  effect, inject, ViewChild, ElementRef, AfterViewChecked
} from '@angular/core';
import { MillionaireService, type Sort, type EnrichedCountry } from './services/millionaire.service';
import { MapViewComponent } from './map-view/map-view.component';

@Component({
  selector: 'app-bitcoin-millionaire',
  standalone: true,
  imports: [MapViewComponent],
  templateUrl: './bitcoin-millionaire.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BitcoinMillionaireComponent implements AfterViewChecked {
  protected svc = inject(MillionaireService);

  @ViewChild('sizer') sizerRef?: ElementRef<HTMLSpanElement>;

  displayCount = signal(0);
  inputWidth = signal(80);
  btcInputValue = signal('0.1');

  readonly viewOptions = [
    { key: 'list', label: 'List' },
    { key: 'map',  label: 'Map'  },
  ] as const;

  readonly sortOptions = [
    { key: 'high',  label: 'Highest' },
    { key: 'low',   label: 'Lowest'  },
    { key: 'alpha', label: 'A–Z'     },
  ] as const;

  showChange = signal(false);

  readonly SATS_PER_BTC = 100_000_000;
  unit = signal<'btc' | 'sat'>('btc');

  unitWord = computed<string>(() => {
    const isSat = this.unit() === 'sat';
    const amount = isSat ? this.svc.btc() * this.SATS_PER_BTC : this.svc.btc();
    const plural = amount > 1;
    return isSat ? (plural ? 'Satoshis' : 'Satoshi') : (plural ? 'Bitcoins' : 'Bitcoin');
  });

  swapHintLabel = computed<string>(() =>
    this.unit() === 'btc' ? 'Swap to Satoshi' : 'Swap to Bitcoin'
  );

  readonly PAGE_SIZE = 24;
  page = signal(0);

  pagedList = computed(() => {
    const start = this.page() * this.PAGE_SIZE;
    return this.svc.filteredList().slice(start, start + this.PAGE_SIZE);
  });

  pageCount = computed(() => Math.ceil(this.svc.filteredList().length / this.PAGE_SIZE));

  showingCount = computed(() => {
    if (this.svc.view() === 'map') {
      return this.svc.onlyMillionaire()
        ? this.svc.millionaireCount()
        : this.svc.totalCount();
    }
    return this.svc.filteredList().length;
  });

  goToPage(n: number): void {
    this.page.set(Math.max(0, Math.min(n, this.pageCount() - 1)));
  }

  get currentYear(): number { return new Date().getFullYear(); }

  readonly lnAddress = 'odevlibertario@coinos.io';
  copied = signal(false);
  private copyTimer: ReturnType<typeof setTimeout> | null = null;

  copyLn(): void {
    if (this.copyTimer !== null) clearTimeout(this.copyTimer);
    try {
      void navigator.clipboard.writeText(this.lnAddress).then(() => {
        this.copied.set(true);
        this.copyTimer = setTimeout(() => { this.copied.set(false); this.copyTimer = null; }, 1600);
      });
    } catch {
      /* clipboard unavailable */
    }
  }

  constructor() {
    let raf: number | null = null;
    let currentDisplay = 0;

    effect(() => {
      this.svc.sort();
      this.svc.onlyMillionaire();
      this.page.set(0);
    }, { allowSignalWrites: true });

    effect(() => {
      const target = this.svc.millionaireCount();
      if (raf !== null) { cancelAnimationFrame(raf); raf = null; }

      const start = currentDisplay;
      if (start === target) return;

      const t0 = performance.now();
      const dur = 350;

      const tick = (now: number) => {
        const k = Math.min(1, (now - t0) / dur);
        const eased = 1 - Math.pow(1 - k, 3);
        currentDisplay = Math.round(start + (target - start) * eased);
        this.displayCount.set(currentDisplay);
        raf = k < 1 ? requestAnimationFrame(tick) : null;
      };
      raf = requestAnimationFrame(tick);
    }, { allowSignalWrites: true });
  }

  private lastSizerText = '';
  ngAfterViewChecked(): void {
    const text = this.btcInputValue();
    if (text !== this.lastSizerText && this.sizerRef?.nativeElement) {
      this.lastSizerText = text;
      const w = Math.max(40, this.sizerRef.nativeElement.offsetWidth + 8);
      if (this.inputWidth() !== w) this.inputWidth.set(w);
    }
  }

  private btcDisplay(btc: number): string {
    return btc.toFixed(8).replace(/\.?0+$/, '');
  }

  toggleUnit(): void {
    if (this.unit() === 'btc') {
      this.btcInputValue.set(Math.round(this.svc.btc() * this.SATS_PER_BTC).toString());
      this.unit.set('sat');
    } else {
      this.btcInputValue.set(this.btcDisplay(this.svc.btc()));
      this.unit.set('btc');
    }
  }

  onBtcInput(e: Event): void {
    const raw = (e.target as HTMLInputElement).value;
    this.btcInputValue.set(raw);
    const v = parseFloat(raw);
    if (!isNaN(v) && v >= 0) {
      this.svc.btc.set(this.unit() === 'sat' ? v / this.SATS_PER_BTC : v);
    }
  }

  onBtcFocus(e: Event): void {
    (e.target as HTMLInputElement).select();
  }

  adjustBtc(delta: number): void {
    const next = Math.max(0, +(this.svc.btc() + delta).toFixed(8));
    this.svc.btc.set(next);
    this.btcInputValue.set(String(next));
  }

  setView(key: string): void {
    this.svc.view.set(key as 'list' | 'map');
  }

  setSort(key: string): void {
    this.svc.sort.set(key as Sort);
  }

  toggleOnlyMillionaire(): void {
    this.svc.onlyMillionaire.update(v => !v);
  }

  formatLocal(value: number): string {
    if (!isFinite(value)) return '—';
    const abs = Math.abs(value);
    const opts: Intl.NumberFormatOptions = abs >= 1e9
      ? { maximumFractionDigits: 2, minimumFractionDigits: 0 }
      : abs >= 100
      ? { maximumFractionDigits: 0 }
      : { maximumFractionDigits: 2 };
    try { return new Intl.NumberFormat('en-US', opts).format(value); }
    catch { return String(Math.round(value)); }
  }

  formatCompact(value: number): string {
    if (!isFinite(value)) return '—';
    return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 }).format(value);
  }

  getPct(local: number): string {
    return Math.min(100, Math.max(0, (local / 1_000_000) * 100)).toFixed(2) + '%';
  }

  getCardMeta(c: EnrichedCountry): string {
    return c.isMillionaire
      ? `${this.formatCompact(c.mult)}× millionaire`
      : `${this.formatCompact(c.local)} of 1,000,000 ${c.code}`;
  }

  private changeValue(code: string): number | null {
    const m = this.svc.btcChanges();
    const v = m[code] ?? m['USD'];
    return typeof v === 'number' && isFinite(v) ? v : null;
  }

  formatChange(code: string): string {
    const v = this.changeValue(code);
    if (v === null) return '—';
    const abs = Math.abs(v).toFixed(2);
    return v >= 0 ? `+${abs}%` : `-${abs}%`;
  }

  changeArrow(code: string): string {
    const v = this.changeValue(code);
    if (v === null || Math.abs(v) < 0.005) return '—';
    return v > 0 ? '↗' : '↘';
  }

  changeDirection(code: string): 'up' | 'down' | 'zero' {
    const v = this.changeValue(code);
    if (v === null || Math.abs(v) < 0.005) return 'zero';
    return v > 0 ? 'up' : 'down';
  }
}
