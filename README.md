# Pactora

[![Check](https://github.com/OWNER/pactora/actions/workflows/check.yml/badge.svg)](https://github.com/OWNER/pactora/actions/workflows/check.yml)

Bring your skill. Find your team. Build together.

This is the Pactora landing page. Developers, artists, creators, marketers, community leads, KOLs and investors find each other on Pactora. They agree on the work in a wallet-signed pact before anyone starts, and get paid for what they actually contribute. The page also covers the $PACT community memecoin on Solana.

The site is plain HTML, CSS and ES modules. There's no build step and nothing to install.

The platform itself (API, web app, payouts) lives in [pactora-app](https://github.com/OWNER/pactora-app).

- X: [@JoinPactora](https://x.com/JoinPactora)
- Telegram: [t.me/pactorateam](https://t.me/pactorateam)

## Run locally

```sh
npm run serve        # or: python -m http.server 8765 -d site
```

Open `http://127.0.0.1:8765`. On localhost the page talks to the app at `http://127.0.0.1:5188`. Start that from `pactora-app` with `npm run dev`.

## How it connects to the app

Both "Join a team" forms post the email to the app's `POST /api/waitlist`. The app then opens its sign-up page with the email already filled in. If the app can't be reached, the visitor still goes straight to sign-up.

The app only accepts waitlist posts from origins listed in its `LANDING_ORIGINS` setting, for example `LANDING_ORIGINS=https://joinpactora.com,https://www.joinpactora.com`.

## Configuration

Everything lives in [`site/config.js`](site/config.js):

| Setting | What it does |
|---|---|
| `APP_URL` | Where the app lives. Defaults to `https://app.<this domain>`. Override it with `window.PACTORA_APP_URL` set before `main.js` loads |
| `SOCIAL` | X and Telegram links, used in the header and footer |
| `TOKEN` | $PACT name, network, supply and venue. Set `contract` to the mint address at launch; until then the page shows "Announced at launch" |

## Layout

```
site/
  index.html     every section of the page
  styles.css     theme tokens, layout, reveal animations, mobile breakpoints
  main.js        role cards, token details, join forms, scroll effects
  config.js      links and token terms
  art/           role photos, crew city, title art, role coins
  brand/         logo, favicon, $PACT coin, social card
scripts/
  check.mjs      parses every module and checks every local file reference
```

## Checks

```sh
npm run check
```

CI runs the same check on every push and pull request.

## Deploy

`site/` is a static folder. Publish it on any static host, such as Cloudflare Pages, Netlify, Vercel or GitHub Pages, with no build command and `site` as the output directory.

## Fonts and art

Newsreader, Inter, DM Mono and Pinyon Script load from Google Fonts under the SIL Open Font License. The role photos, crew-city art, title art, role coins, logo and $PACT coin are Pactora's own and are covered by this repository's license.

## $PACT

$PACT is a community memecoin. Holding it gives no ownership of Pactora, no share of any project's earnings and no trust badge, and you don't need it to use Pactora. The terms on this page are proposed and may change before launch. Nothing here is financial advice.

## Contributing

Issues and pull requests are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT. See [LICENSE](LICENSE).
