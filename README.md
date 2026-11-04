# RelayWorks

Your AI agent quit at 70%. Patch finishes the job.

The RelayWorks website and recovery console. It has a comic landing page, a live console where you hand a broken agent job to a specialist, the $RELAY token page, and a product blueprint. It's buildless HTML, CSS and ES modules. There's no bundler and no dependency installation.

The control API, worker and verifier live in [relayworks-recovery](https://github.com/relayworkslab/relayworks-recovery).

- Site: https://relayworks.fun
- X: [@RelayWorksHQ](https://x.com/RelayWorksHQ)
- Email: support@relayworks.fun

## Run locally

```sh
python -m http.server 8080 -d dist
```

Open `http://127.0.0.1:8080`. The app uses hash routes:

| Route | Page |
|---|---|
| `#/` | Landing page |
| `#/app/overview` | Console overview |
| `#/app/jobs` | Recovery jobs, filters and search |
| `#/app/jobs/RW-024` | A recovery workflow |
| `#/app/market` | Specialist network |
| `#/app/receipts` | Receipts |
| `#/app/settings` | Local preferences and reset |
| `#/token` | Token and launch status |
| `#/docs` | Product, architecture, integration and milestones |

`dist/config.js` holds every link and token detail, and `apiBase` points the console at the control API. When the API is reachable, the console signs in with a Solana wallet, uploads the package, and pays USDC through x402 only after you accept the output.

## Layout

```
dist/            the deployed site (static)
  main.js        router and action state
  landing.js     marketing pages
  app.js         console views
  api.js         control API client
  art.js         hand-built SVG character kit (Patch, Gary, Atlas, Mender, Restart)
  *-model.js     procedural Three.js geometry
  *-scene.js     WebGL scenes with damped pointer tracking and reduced motion
  x402-pay.js    browser payment bundle, built from relayworks-recovery
  vendor/        Three.js 0.180.0
brand/           social and launchpad PNGs
docs/            asset provenance, model notes, QA
scripts/         model export, brand rendering and browser QA
video/           the 90 s intro film, rendered from HTML
```

## Checks

```sh
npm run check                                  # parse every module with Node
node scripts/flow-test.mjs                     # click through a rescue in headless Chrome (site on :8765)
node scripts/mobile-shot.mjs <url> <out.png>   # phone screenshot plus overflow report
```

## Deploy

`npm run deploy:cf` publishes `dist/` as Cloudflare Workers static assets (see `wrangler.jsonc`).

## Intro video

`video/intro.html` is a deterministic 90-second timeline. `video/render.mjs` renders it frame by frame in headless Chrome and pipes the frames into ffmpeg, and `video/soundtrack.py` synthesizes the score. See `video/README.md`.

## Art and fonts

All characters are original SVG in `dist/art.js` and original procedural geometry in `dist/specialist-model.js`. DM Sans and Lilita One are used under the SIL Open Font License (`dist/assets/OFL.txt`). Three.js is MIT (`dist/vendor/LICENSE-three.txt`). See `docs/ASSETS.md`.

## Token

$RELAY is a memecoin. It doesn't give you shares, revenue or votes, and you don't need it to use RelayWorks. Nothing here is financial advice.

## License

MIT. See `LICENSE`.
