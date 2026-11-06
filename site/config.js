// Every link and token detail on the site lives here.
// APP_URL: set window.PACTORA_APP_URL before this script loads, or edit the fallback below.
const local = /^(127\.0\.0\.1|localhost)$/.test(location.hostname);

export const APP_URL = String(
  globalThis.PACTORA_APP_URL || (local ? 'http://127.0.0.1:5188' : `https://app.${location.hostname.replace(/^www\./, '')}`),
).replace(/\/$/, '');

export const SOCIAL = {
  x: 'https://x.com/JoinPactora',
  telegram: 'https://t.me/pactorateam',
};

// Proposed launch terms. Keep in sync with what is published at launch.
export const TOKEN = {
  name: 'Pactora',
  symbol: '$PACT',
  network: 'Solana',
  supply: '1,000,000,000',
  venue: 'pump.fun (public launch)',
  contract: null, // set to the mint address once the token is live
};
