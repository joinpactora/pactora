# Contributing

1. Fork, then branch from `main`.
2. `npm run check` must pass. For console changes, also run `node scripts/flow-test.mjs` against a local server.
3. Keep pages working at phone width (`node scripts/mobile-shot.mjs`) and with reduced motion.
4. Keep commits focused, with messages in the form `type(scope): summary` (`feat`, `fix`, `style`, `docs`, `refactor`, `build`, `ci`, `chore`).
5. Open a pull request that describes the change, with a screenshot for anything visual.

Never commit keys or `.env` files.
