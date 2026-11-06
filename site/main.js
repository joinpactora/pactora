import { APP_URL, SOCIAL, TOKEN } from './config.js';

const ROLES = [
  { id: 'developer', name: 'Developer', role: 'Builds the product', text: 'Build and maintain the product. A project can start with this role alone. The token is one milestone, not the goal.' },
  { id: 'artist', name: 'Artist', role: 'Art and brand', text: 'Create the artwork, identity and motion people recognise the project by.' },
  { id: 'creator', name: 'Creator', role: 'Video and content', text: 'Produce videos, posts and writing that show the work as it happens.' },
  { id: 'marketer', name: 'Marketer', role: 'Campaigns', text: 'Plan campaigns that reach users who actually want the product.' },
  { id: 'community', name: 'Community', role: 'Members and events', text: 'Support members, run activities and keep the conversation healthy and useful.' },
  { id: 'kol', name: 'KOL', role: 'Audience', text: 'Share the project with an audience that cares about it. Paid promotion is always disclosed.' },
  { id: 'investor', name: 'Investor', role: 'Funding', text: 'Review the team, the work and the plan, then fund it under a separate written agreement.' },
  { id: 'founder', name: 'Founder', role: 'Leads the crew', text: 'Set the direction, write the pact and keep everyone moving toward the same launch.' },
];

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// links
document.querySelectorAll('[data-social]').forEach((a) => { a.href = SOCIAL[a.dataset.social]; });
document.querySelectorAll('[data-app]').forEach((a) => { a.href = APP_URL + a.dataset.app; });
document.querySelectorAll('[data-year]').forEach((n) => { n.textContent = new Date().getFullYear(); });

// roles
document.querySelector('[data-roles]').innerHTML = ROLES.map((r, i) => `
  <a class="role reveal" style="--i:${i % 4}" href="${esc(APP_URL)}/signup?role=${r.id}">
    <img src="art/roles/${r.id}.webp" alt="" loading="lazy" width="800" height="890" />
    <div class="role-body"><span class="mono">${String(i + 1).padStart(2, '0')} · ${esc(r.role)}</span><h3>${esc(r.name)}</h3><p>${esc(r.text)}</p></div>
  </a>`).join('');

// token
document.querySelector('[data-token-dl]').innerHTML = [
  ['Token', `${TOKEN.name} (${TOKEN.symbol})`], ['Network', TOKEN.network], ['Supply', TOKEN.supply], ['Venue', TOKEN.venue],
  ['Allocation', '100% public, incl. venue liquidity'], ['Team buys', 'Disclosed with wallets and amounts'],
].map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('');
const ca = document.querySelector('[data-ca]');
ca.innerHTML = TOKEN.contract
  ? `<span class="ca-label">Contract</span><code>${esc(TOKEN.contract)}</code><button type="button" class="btn btn-light btn-sm" data-copy>Copy</button>`
  : '<span class="ca-label">Contract</span><code>Announced at launch</code><span class="ca-note">Only trust the address shown here and on our official channels</span>';
ca.querySelector('[data-copy]')?.addEventListener('click', async (e) => {
  try { await navigator.clipboard.writeText(TOKEN.contract); e.target.textContent = 'Copied'; } catch { /* clipboard blocked */ }
});

// join forms: add to the app's waitlist, then open sign-up with the email filled in
document.querySelectorAll('form[data-join]').forEach((form) => form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const input = form.querySelector('input[type="email"]');
  const email = input.value.trim();
  const note = form.nextElementSibling?.matches('[data-join-note]') ? form.nextElementSibling : null;
  if (!/^\S+@\S+\.\S+$/.test(email)) { input.focus(); if (note) note.textContent = 'Enter a valid email address.'; return; }
  const btn = form.querySelector('button');
  btn.disabled = true; btn.textContent = 'Joining…';
  const fallback = `${APP_URL}/signup?email=${encodeURIComponent(email)}`;
  try {
    const r = await fetch(`${APP_URL}/api/waitlist`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, source: 'landing' }) });
    const data = await r.json().catch(() => ({}));
    location.href = r.ok && data.next ? data.next : fallback;
  } catch {
    location.href = fallback; // app unreachable from here: sign-up still works
  }
}));

// header shadow + reveal on scroll + gentle hero parallax
const top = document.querySelector('[data-top]');
const onScroll = () => top.classList.toggle('scrolled', scrollY > 12);
addEventListener('scroll', onScroll, { passive: true });
onScroll();

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const items = document.querySelectorAll('.reveal');
if (reduce || !('IntersectionObserver' in window)) items.forEach((n) => n.classList.add('in'));
else {
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
  }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  items.forEach((n) => io.observe(n));
}

const art = document.querySelector('[data-parallax]');
if (art && !reduce) {
  let raf = 0;
  addEventListener('scroll', () => {
    if (raf) return;
    raf = requestAnimationFrame(() => { raf = 0; const y = Math.min(scrollY, innerHeight); art.style.transform = `translate3d(0, ${y * 0.18}px, 0) scale(${1.06 + y / innerHeight * 0.04})`; });
  }, { passive: true });
}
