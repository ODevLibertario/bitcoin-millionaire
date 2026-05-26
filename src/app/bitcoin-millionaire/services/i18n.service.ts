import { Injectable, signal, computed, effect } from '@angular/core';

export type Locale = 'en-US' | 'pt-BR';

function detectLocale(): Locale {
  try {
    const saved = localStorage.getItem('locale');
    if (saved === 'pt-BR' || saved === 'en-US') return saved;
  } catch { /* private browsing */ }
  const nav = (navigator.language || navigator.languages?.[0] || '').toLowerCase();
  return nav.startsWith('pt') ? 'pt-BR' : 'en-US';
}

const TRANSLATIONS = {
  'en-US': {
    live:                       'live',
    hero_owning:                'Owning',
    btc_singular:               'Bitcoin',
    btc_plural:                 'Bitcoins',
    sat_singular:               'Satoshi',
    sat_plural:                 'Satoshis',
    swap_to_sat:                'Swap to Satoshi',
    swap_to_btc:                'Swap to Bitcoin',
    hero_makes_millionaire:     'makes you a millionaire in',
    hero_countries:             'countries.',
    stat_holding:               'Your holding',
    stat_usd_value:             'USD value',
    stat_millionaire_in:        'Millionaire in',
    stat_richest_in:            'Richest in',
    stat_of:                    'of',
    view_list:                  'List',
    view_map:                   'Map',
    sort_high:                  'Highest',
    sort_low:                   'Lowest',
    sort_alpha:                 'A–Z',
    controls_showing:           'Showing',
    controls_of:                'of',
    toggle_millionaire_only:    'Millionaire only',
    toggle_24h_change:          '24h change',
    badge_millionaire:          'Millionaire',
    card_24h_label:             '24h',
    card_meta_millionaire:      '× millionaire',
    card_meta_of:               'of',
    empty_title:                'Not yet, anywhere.',
    empty_sub:                  'Increase your holding to light up the world.',
    footer_crafted_by:          'Crafted by',
    footer_source_code:         'Source Code',
    footer_disclaimer:          '* BTC price and FX rates are updated every 30 minutes.',
    footer_tip_lightning:       'Tip via Lightning',
    footer_copy_aria:           'Copy Lightning address',
    footer_copied:              'Copied ✓',
    map_loading:                'Drawing the world…',
    map_legend_millionaire:     'Millionaire',
    map_legend_not_yet:         'Not yet',
    map_legend_hover:           'Hover over any country',
    map_error_failed:           "Couldn't load the world map.",
    map_error_unknown:          'Unknown error loading map.',
    map_detail_millionaire:     '× millionaire',
    map_detail_of:              'of',
  },
  'pt-BR': {
    live:                       'ao vivo',
    hero_owning:                'Com',
    btc_singular:               'Bitcoin',
    btc_plural:                 'Bitcoins',
    sat_singular:               'Satoshi',
    sat_plural:                 'Satoshis',
    swap_to_sat:                'Trocar para Satoshi',
    swap_to_btc:                'Trocar para Bitcoin',
    hero_makes_millionaire:     'você se torna milionário em',
    hero_countries:             'países.',
    stat_holding:               'Seu saldo',
    stat_usd_value:             'Valor em USD',
    stat_millionaire_in:        'Milionário em',
    stat_richest_in:            'Mais rico em',
    stat_of:                    'de',
    view_list:                  'Lista',
    view_map:                   'Mapa',
    sort_high:                  'Maior',
    sort_low:                   'Menor',
    sort_alpha:                 'A–Z',
    controls_showing:           'Mostrando',
    controls_of:                'de',
    toggle_millionaire_only:    'Apenas milionários',
    toggle_24h_change:          'Variação 24h',
    badge_millionaire:          'Milionário',
    card_24h_label:             '24h',
    card_meta_millionaire:      '× milionário',
    card_meta_of:               'de',
    empty_title:                'Ainda não, em lugar algum.',
    empty_sub:                  'Aumente seu saldo para iluminar o mundo.',
    footer_crafted_by:          'Feito por',
    footer_source_code:         'Código fonte',
    footer_disclaimer:          '* O preço do BTC e as taxas de câmbio são atualizados a cada 30 minutos.',
    footer_tip_lightning:       'Doe via Lightning',
    footer_copy_aria:           'Copiar endereço Lightning',
    footer_copied:              'Copiado ✓',
    map_loading:                'Desenhando o mundo…',
    map_legend_millionaire:     'Milionário',
    map_legend_not_yet:         'Ainda não',
    map_legend_hover:           'Passe o mouse em qualquer país',
    map_error_failed:           'Não foi possível carregar o mapa.',
    map_error_unknown:          'Erro desconhecido ao carregar o mapa.',
    map_detail_millionaire:     '× milionário',
    map_detail_of:              'de',
  },
} as const;

export type TranslationDict = { readonly [K in keyof typeof TRANSLATIONS['en-US']]: string };

@Injectable({ providedIn: 'root' })
export class I18nService {
  locale = signal<Locale>(detectLocale());
  t = computed<TranslationDict>(() => TRANSLATIONS[this.locale()] as TranslationDict);

  constructor() {
    effect(() => { document.documentElement.lang = this.locale(); });
  }

  setLocale(loc: Locale): void {
    try { localStorage.setItem('locale', loc); } catch { /* private browsing */ }
    this.locale.set(loc);
  }

  unitWord(amount: number, unit: 'btc' | 'sat'): string {
    const dict = this.t();
    const plural = amount >= 2;
    if (unit === 'sat') return plural ? dict.sat_plural : dict.sat_singular;
    return plural ? dict.btc_plural : dict.btc_singular;
  }
}
