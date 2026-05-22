import {
  Component, ChangeDetectionStrategy, computed, signal, inject, OnInit, input
} from '@angular/core';
import { geoNaturalEarth1, geoPath, geoGraticule10 } from 'd3-geo';
import { feature } from 'topojson-client';
import { MillionaireService, type EnrichedCountry } from '../services/millionaire.service';
import { CCY_TO_GEO } from '../data/ccy-to-geo';

const MAP_W = 1000;
const MAP_H = 520;

interface MapFeature {
  id: string;
  name: string;
  d: string;
  ccyCode: string | null;
}

interface OrderedFeature extends MapFeature {
  cls: string;
  useFilter: boolean;
}

@Component({
  selector: 'app-map-view',
  standalone: true,
  imports: [],
  templateUrl: './map-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapViewComponent implements OnInit {
  readonly MAP_W = MAP_W;
  readonly MAP_H = MAP_H;

  protected svc = inject(MillionaireService);

  onlyMillionaire = input<boolean>(false);

  features = signal<MapFeature[] | null>(null);
  graticule = signal<string>('');
  loadError = signal<string | null>(null);
  hovered = signal<string | null>(null);

  enrichedByCode = computed<Map<string, EnrichedCountry>>(() => {
    const m = new Map<string, EnrichedCountry>();
    for (const c of this.svc.enriched()) m.set(c.code, c);
    return m;
  });

  hoveredEntry = computed<EnrichedCountry | null>(() => {
    const h = this.hovered();
    return h ? (this.enrichedByCode().get(h) ?? null) : null;
  });

  orderedFeatures = computed<OrderedFeature[]>(() => {
    const feats = this.features();
    if (!feats) return [];
    const h = this.hovered();
    const ebc = this.enrichedByCode();
    const mute = this.onlyMillionaire();

    return [...feats]
      .sort((a, b) => {
        if (a.ccyCode === h) return 1;
        if (b.ccyCode === h) return -1;
        const aw = a.ccyCode && ebc.get(a.ccyCode)?.isMillionaire ? 1 : 0;
        const bw = b.ccyCode && ebc.get(b.ccyCode)?.isMillionaire ? 1 : 0;
        return aw - bw;
      })
      .map(f => {
        const enr = f.ccyCode ? ebc.get(f.ccyCode) : undefined;
        const isWin = enr?.isMillionaire ?? false;
        const inData = !!enr;
        const isHov = f.ccyCode !== null && f.ccyCode === h;
        const isMute = mute && !isWin;

        let cls = 'country';
        if (isWin) cls += ' country--win';
        else if (inData) cls += ' country--in';
        else cls += ' country--other';
        if (isHov) cls += ' country--hov';
        if (isMute) cls += ' country--mute';

        return { ...f, cls, useFilter: isWin } satisfies OrderedFeature;
      });
  });

  async ngOnInit(): Promise<void> {
    try {
      const win = window as unknown as Record<string, unknown>;
      const cached = win['__worldTopo'];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let topo: any = cached;
      if (!topo) {
        const res = await fetch('https://unpkg.com/world-atlas@2.0.2/countries-110m.json');
        if (!res.ok) throw new Error('Failed to load world map data');
        topo = await res.json();
        win['__worldTopo'] = topo;
      }

      const nameToCcy = new Map<string, string>();
      for (const [code, names] of Object.entries(CCY_TO_GEO)) {
        for (const name of names) nameToCcy.set(name.toLowerCase(), code);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const coll = feature(topo, topo.objects.countries) as any;
      const proj = geoNaturalEarth1().fitSize([MAP_W, MAP_H], coll);
      const pathGen = geoPath(proj);

      this.graticule.set(pathGen(geoGraticule10()) ?? '');

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const feats: MapFeature[] = (coll.features as any[])
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((f: any) => {
          const name: string = f?.properties?.name ?? '';
          const ccyCode = nameToCcy.get(name.toLowerCase()) ?? null;
          const d: string = pathGen(f) ?? '';
          const id: string = f?.id?.toString() ?? name;
          return { id, name, d, ccyCode };
        })
        .filter((f: MapFeature) => f.d.length > 0);

      this.features.set(feats);
    } catch (e: unknown) {
      this.loadError.set(e instanceof Error ? e.message : 'Unknown error loading map');
    }
  }

  onMouseEnter(f: MapFeature): void {
    if (f.ccyCode && this.enrichedByCode().has(f.ccyCode)) {
      this.hovered.set(f.ccyCode);
    }
  }

  onMouseLeave(f: MapFeature): void {
    if (this.hovered() === f.ccyCode) this.hovered.set(null);
  }

  onMapLeave(): void {
    this.hovered.set(null);
  }

  formatCompact(value: number): string {
    if (!isFinite(value)) return '—';
    return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 }).format(value);
  }

  formatInt(value: number): string {
    if (!isFinite(value)) return '—';
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);
  }
}
