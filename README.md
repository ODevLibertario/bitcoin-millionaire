# Bitcoin Millionaire

> **How many countries would make you a millionaire?**

Enter your Bitcoin (or Satoshi) holding and instantly see in which of the world's currencies your stack already crosses the million mark — with live BTC price and FX rates refreshed every 30 minutes.

Built by [O Dev Libertário](https://x.com/ODevLibertario)

---

## Features

- **Live BTC price** via CoinGecko, cached locally for 30 minutes
- **Live FX rates** for 170+ currencies via Open Exchange Rates
- **Bitcoin ↔ Satoshi toggle** — click the word "Bitcoin" in the hero to switch units
- **24h change chip** — per-currency BTC price change, toggleable on each card
- **Interactive world map** — see your millionaire status geographically
- **Sort & filter** — by highest value, lowest, or A–Z; filter to millionaire countries only
- **Privacy-respecting analytics** — GoatCounter, no cookies, no personal data

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Angular 21 (standalone components, signals) |
| Rendering | `ChangeDetectionStrategy.OnPush` throughout |
| Map | D3-geo + TopoJSON |
| Styling | Vanilla CSS with custom properties |
| Fonts | Instrument Serif · DM Sans · JetBrains Mono |
| BTC price | CoinGecko `simple/price` API |
| FX rates | Open ER-API |
| Analytics | GoatCounter |

## Getting Started

```bash
npm install
npm start
```

Open [http://localhost:4200](http://localhost:4200).

### Production build

```bash
npm run build
```

Output goes to `dist/bitcoin-millionaire/browser`. Deploy to any static host (Netlify, Vercel, Cloudflare Pages, etc.).

## Data & Privacy

- BTC price and FX rates are fetched from public APIs and cached in `localStorage` for 30 minutes. No user data is ever sent to any server.
- Analytics are powered by [GoatCounter](https://www.goatcounter.com/) — page view counts only, no fingerprinting, no cookies, fully GDPR-compliant.

## Contributing

Issues and pull requests are welcome. The project is intentionally simple — no state management library, no component library, no build-time data fetching. Keep it that way.

## Support

If this tool saved you from converting decimals by hand, consider a tip via Lightning:

⚡ `odevlibertario@coinos.io`

## License

See [LICENSE.txt](./LICENSE.txt).
