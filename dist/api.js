import { site } from './config.js';

const TOKEN_KEY = 'relayworks-session';
const WALLET_KEY = 'relayworks-wallet';
export const apiEnabled = () => Boolean(site.apiBase);

export function sessionToken() {
  try { return localStorage.getItem(TOKEN_KEY) || '' } catch { return '' }
}

export function signedInWallet() {
  if (!sessionToken()) return '';
  try {
    const saved = localStorage.getItem(WALLET_KEY) || '';
    if (saved) return saved;
  } catch { /* Phantom can still supply the connected address */ }
  const provider = walletProvider();
  return provider?.publicKey?.toString?.() || '';
}

export async function signOut() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(WALLET_KEY);
  } catch { /* the button still returns the console to signed-out */ }
  const provider = walletProvider();
  try { if (provider?.disconnect) await provider.disconnect() } catch { /* the local session is already cleared */ }
}

function walletProvider() {
  const provider = window.phantom?.solana || window.solana;
  return provider && (provider.signIn || provider.signMessage) ? provider : null;
}

let sessionPromise = null;

function bytesToBase64(bytes) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

async function request(path, { method = 'GET', json, body, headers } = {}) {
  const token = sessionToken();
  const response = await fetch(site.apiBase + path, {
    method,
    headers: {
      ...(json ? { 'content-type': 'application/json' } : {}),
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ?? (json ? JSON.stringify(json) : undefined),
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  if (response.status === 402) return { paymentRequired: true, ...data };
  if (response.status === 401) {
    try { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(WALLET_KEY) } catch { /* the next action asks for the wallet again */ }
  }
  if (!response.ok) throw new Error(data.error || `Request failed (${response.status}).`);
  return data;
}

export function ensureSession() {
  if (sessionToken()) return Promise.resolve();
  if (!sessionPromise) sessionPromise = signInOnce().finally(() => { sessionPromise = null });
  return sessionPromise;
}

async function signInOnce() {
  const provider = walletProvider();
  if (!provider) throw new Error('NO_WALLET');
  const connected = provider.publicKey ? provider : await provider.connect();
  const wallet = (connected.publicKey || provider.publicKey).toString();
  const challenge = await request('/v1/auth/challenge', { method: 'POST', json: { wallet } });
  const signed = await signChallenge(provider, challenge);
  const signature = bytesToBase64(signed.signature || signed);
  const verified = await request('/v1/auth/verify', { method: 'POST', json: { wallet, signature } });
  localStorage.setItem(TOKEN_KEY, verified.token);
  localStorage.setItem(WALLET_KEY, wallet);
}

async function signChallenge(provider, challenge) {
  if (challenge.signIn && typeof provider.signIn === 'function') {
    const output = await provider.signIn(challenge.signIn);
    const signedText = new TextDecoder().decode(output.signedMessage);
    if (signedText !== challenge.message) throw new Error('Wallet signed a different sign-in message. Try again.');
    const address = output.account?.address || output.account?.publicKey?.toString?.();
    if (address && address !== challenge.signIn.address) throw new Error('Sign in with the same wallet you connected.');
    return output;
  }
  return provider.signMessage(new TextEncoder().encode(challenge.message), 'utf8');
}

export async function loadProviders() {
  const { providers } = await request('/v1/providers');
  return providers;
}

const labels = {
  validated: 'Needs rescue',
  quoted: 'Needs rescue',
  authorized: 'Recovering',
  leased: 'Recovering',
  recovering: 'Recovering',
  verifying: 'Recovering',
  awaiting_review: 'Awaiting review',
  accepted: 'Accepted',
  settled: 'Verified',
  payout_pending: 'Verified',
  rejected: 'Rejected',
  failed: 'Failed',
  expired: 'Expired',
  cancelled: 'Cancelled',
  disputed: 'Disputed',
  refund_pending: 'Disputed',
  refunded: 'Refunded',
};

function onChainSignature(value) {
  return Boolean(value) && !String(value).startsWith('fake-');
}

function presentEvent(event) {
  const label = typeof event.label === 'string' ? event.label : '';
  const detail = typeof event.detail === 'string' ? event.detail : '';
  if (!detail.includes('fake-')) return event;
  if (label === '8004 feedback') return { ...event, label: 'Feedback recorded', detail: 'Stored with this receipt.' };
  if (label === 'USDC settled' || label === 'Fixer paid') return { ...event, detail: 'Receipt recorded.' };
  return { ...event, detail: detail.replace(/\bfake-/g, '').replace(/\s{2,}/g, ' ').trim() };
}

export function mapJob(job) {
  const paymentSignature = job.receipt?.paymentSignature || null;
  return {
    id: job.id,
    title: job.title,
    type: 'Structured data',
    total: job.totalUnits,
    completed: job.completedUnits,
    originalCompleted: job.preservedUnits,
    status: labels[job.status] || job.status,
    apiStatus: job.status,
    paymentPending: Boolean(job.paymentPending),
    budget: job.budgetCents / 100,
    provider: job.providerId,
    price: (job.quoteCents || 0) / 100,
    live: true,
    acceptanceVersion: job.acceptanceVersion,
    onChain: onChainSignature(paymentSignature),
    paymentSignature: onChainSignature(paymentSignature) ? paymentSignature : paymentSignature ? 'Recorded' : null,
    payoutSignature: onChainSignature(job.receipt?.payoutSignature) ? job.receipt.payoutSignature : null,
    refundSignature: onChainSignature(job.receipt?.refundSignature) ? job.receipt.refundSignature : null,
    receiptStatus: job.receipt?.status || null,
    acceptedAt: job.acceptance?.acceptedAt || null,
    verification: job.verification,
    package: job.package,
    created: 'Today',
    events: (job.events || []).map(presentEvent),
  };
}

export async function loadJobs() {
  const { jobs } = await request('/v1/jobs');
  return jobs.map(mapJob);
}

export function sampleChunkFiles() {
  return Array.from({ length: 10 }, (_, chunk) => {
    const id = `chunk-${String(chunk + 1).padStart(3, '0')}`;
    const records = Array.from({ length: 10 }, (_, row) => {
      const n = chunk * 10 + row + 1;
      return { id: String(n).padStart(3, '0'), company: `Co ${n}`, country: chunk >= 7 ? '??' : 'US' };
    });
    return new File([JSON.stringify(records)], `${id}.json`, { type: 'application/json' });
  });
}

export function withSampleNormalize(pkg) {
  return {
    ...pkg,
    normalize: pkg.normalize || { fields: { country: { aliases: { '??': 'US', USA: 'US', 'United States': 'US' } } } },
  };
}

export async function createRecovery({ title, budget, pkg, files }) {
  const body = new FormData();
  body.set('package', JSON.stringify(pkg));
  body.set('title', title);
  body.set('budgetCents', String(Math.round(Number(budget) * 100)));
  for (const file of files) body.append('chunk', file, file.name);
  return mapJob(await request('/v1/jobs', { method: 'POST', body, headers: { 'idempotency-key': crypto.randomUUID() } }));
}

export async function authorizeRecovery(id, providerId, budget, acceptanceVersion) {
  await request(`/v1/jobs/${id}/quote`, { method: 'POST', json: { providerId } });
  return mapJob(await request(`/v1/jobs/${id}/authorize`, {
    method: 'POST',
    json: { providerId, ceilingCents: Math.round(Number(budget) * 100), deadlineMinutes: 60, acceptanceVersion },
  }));
}

export async function acceptJob(id) {
  return mapJob(await request(`/v1/jobs/${id}/accept`, { method: 'POST', json: {} }));
}

export async function rejectJob(id) {
  return mapJob(await request(`/v1/jobs/${id}/reject`, { method: 'POST', json: {} }));
}

export async function cancelJob(id) {
  return mapJob(await request(`/v1/jobs/${id}/cancel`, { method: 'POST', json: {} }));
}

export async function retryJob(id) {
  return mapJob(await request(`/v1/jobs/${id}/retry`, { method: 'POST', json: { deadlineMinutes: 60 } }));
}

export async function disputeJob(id, reason) {
  return mapJob(await request(`/v1/jobs/${id}/dispute`, { method: 'POST', json: { reason } }));
}

async function paymentHeader(required, approvedTotalCents) {
  const mode = required.accepts?.[0]?.extra?.mode;
  if (mode === 'fake') return 'local-demo';
  const { createPaymentHeader } = await import('./x402-pay.js');
  return createPaymentHeader(required, walletProvider(), site.apiBase + '/v1/solana/rpc', approvedTotalCents);
}

export async function settleJob(id) {
  const first = await request(`/v1/jobs/${id}/settle`, { method: 'POST', json: {} });
  if (!first.paymentRequired) return mapJob(first);
  const job = await request(`/v1/jobs/${id}`);
  const header = await paymentHeader(first, job.totalCents);
  return mapJob(await request(`/v1/jobs/${id}/settle`, {
    method: 'POST',
    json: {},
    headers: { 'payment-signature': header },
  }));
}

export function loadOutput(id) {
  return request(`/v1/jobs/${encodeURIComponent(id)}/output`);
}
