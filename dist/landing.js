import {icon,logo,esc} from './ui.js';
import {site,tokenLive,shortCa} from './config.js';
import {heroScene,panel,portrait,mood} from './art.js';

const xIcon=`<svg class="icon" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.2-8.3L1.8 3h6.4l4.4 5.8L17.8 3Zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5Z"/></svg>`;
const ghIcon=`<svg class="icon" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.4-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .8.1-.7.4-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.6 9.6 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9V21c0 .3.2.6.7.5A10 10 0 0 0 12 2Z"/></svg>`;
const mailIcon=icon('mail');
export const social={xIcon,ghIcon};

export function caChip(extra=''){const live=tokenLive();return `<div class="f-ca ${extra}"><span class="f-ca-label">CA</span><code>${live?esc(shortCa()):'coming soon'}</code>${live?`<button class="f-ca-copy" data-action="copy-ca" aria-label="Copy contract address">${icon('copy')}</button>`:`<span class="f-ca-soon" title="Only trust relayworks.fun and ${site.xHandle}">${icon('clock')}</span>`}</div>`}
export function socials(cls=''){return `<div class="f-socials ${cls}"><a href="${site.x}" target="_blank" rel="noreferrer" aria-label="RelayWorks on X">${xIcon}</a><a href="${site.github}" target="_blank" rel="noreferrer" aria-label="RelayWorks on GitHub">${ghIcon}</a>${site.telegram?`<a href="${site.telegram}" target="_blank" rel="noreferrer" aria-label="RelayWorks on Telegram">${icon('right')}</a>`:''}<a href="mailto:${site.email}" aria-label="Email RelayWorks">${mailIcon}</a></div>`}

const ticker=['gary.exe has stopped working','70 rows done, 30 to go','brb (he did not brb)','do not press restart','patch has tape',`${site.token.ticker} on ${site.token.launchpad}`,tokenLive()?`CA ${shortCa()}`:'CA: coming soon',`follow ${site.xHandle}`];
export function header(){return `<div class="f-marquee" aria-hidden="true"><div>${[...ticker,...ticker].map(t=>`<span>${esc(t)}</span><i>✦</i>`).join('')}</div></div><header class="f-header"><div class="f-nav">${logo()}<nav class="f-links" aria-label="Main navigation"><a href="#saga">The saga</a><a href="#crew">The crew</a><a href="#how">How it works</a><a href="#/token">${site.token.ticker}</a></nav><div class="f-nav-actions">${socials('f-nav-socials')}<a href="#/app/overview" class="f-btn f-btn-ink f-btn-sm">Open console</a><button class="icon-btn mobile-toggle f-burger" data-action="mobile-nav" aria-label="Open menu" aria-expanded="false">${icon('menu')}</button></div></div><div class="reading-progress" id="reading-progress"></div><nav class="mobile-nav f-mobile" aria-label="Mobile navigation"><a href="#saga">The saga</a><a href="#crew">The crew</a><a href="#how">How it works</a><a href="#/token">${site.token.ticker}</a><a href="#/app/overview">Open console</a><a href="#/docs">Blueprint</a>${socials()}</nav></header>`}
export function footer(){return `<footer class="f-footer"><div class="f-footer-main"><div class="f-footer-brand">${logo()}<p>We finish what your agent started.</p>${socials()}</div><div class="f-footer-cols"><div><strong>The story</strong><a href="#saga">The saga</a><a href="#crew">The crew</a><a href="#how">How it works</a><a href="#/token">${site.token.ticker}</a></div><div><strong>Product</strong><a href="#/app/overview">Console</a><a href="#/app/jobs">Jobs</a><a href="#/app/receipts">Receipts</a><a href="#/docs">Blueprint</a></div><div><strong>Say hi</strong><a href="${site.x}" target="_blank" rel="noreferrer">X ${site.xHandle}</a><a href="${site.github}" target="_blank" rel="noreferrer">GitHub /${site.githubHandle}</a><a href="mailto:${site.email}">${site.email}</a></div></div></div><div class="f-footer-word" aria-hidden="true">relayworks</div><div class="f-footer-bottom"><span>© ${new Date().getFullYear()} RelayWorks · ${site.domain}</span><span>${site.token.ticker} is a memecoin. Nothing here is financial advice.</span><a href="#main">Back to top ↑</a></div></footer>`}

// Kept for the router; the landing page no longer has step tabs.
export function stepPanel(){return ''}

const chapters=[
 ['Chapter 1','Gary had one job.','Enrich 100 customer rows. Coffee in hand. Vibes immaculate.'],
 ['Chapter 2','Then came row 71.','The country field said "??". Gary said "brb" and was never seen again.'],
 ['Chapter 3','Enter the villain.','The Restart Button wants to wipe all 70 good rows and bill you for 100. Again.'],
 ['Chapter 4','Patch rolls in.','Keeps the 70. Fixes the 30. Checks the work. Prints a receipt. Goes back to napping.']
];
const crew=[
 ['patch','Patch','The Fixer','Finishes other agents\' half-done jobs. Carries tape at all times.','Duct Tape Resume','Naps between jobs',[['Finishing',96],['Patience',88]]],
 ['atlas','Atlas','The Reader','Reads every document so you don\'t have to. Cites the page, too.','Source Trace','Corrects your grammar',[['Reading',94],['Chill',41]]],
 ['mender','Mender','The Checker','Checks every row twice. Then once more, to be safe.','Duplicate Hunter','Trust issues',[['Checking',98],['Trust',12]]],
 ['gary','Gary','The Agent','Starts every job with full confidence. Finishes none of them.','Confident Start','Row 71',[['Starting',99],['Finishing',7]]],
 ['restart','Restart Button','The Villain','Deletes progress for fun. Charges full price for the redo.','Wipe Everything','Patch',[['Chaos',100],['Mercy',0]]]
];
const steps=[
 ['01','Save the checkpoint','Your agent\'s finished rows get saved, plus a note on what broke and what "done" means.','folder'],
 ['02','Pick a fixer','Compare quotes from specialists like Patch. Set a max budget so nobody gets creative with your wallet.','network'],
 ['03','Finish only what\'s left','The fixer gets the 30 broken rows. Not your keys. Not the whole project. Just the leftovers.','refresh'],
 ['04','Check it, then pay','Automatic checks confirm nothing got lost or duplicated. You approve, you get a receipt.','shield']
];
const episodes=[
 ['Ep. 1','Patch gets a website','Landing page and a live recovery console. You are here.','done'],
 ['Ep. 2',`${site.token.ticker} launches`,`Community coin on ${site.token.launchpad}. CA posted here and on ${site.xHandle} only.`,'next'],
 ['Ep. 3','Patch fixes a real job','First real recovery of a broken data job, start to finish, with real checks.',''],
 ['Ep. 4','The crew grows','More fixers, paid recoveries with real teams, and more ways to plug in your agent.','']
];
const faqs=[
 ['Is Patch real?','Patch is our mascot and the first fixer on the crew. The console is live: sign in with a wallet, send the leftover work, and pay in USDC after you accept it.'],
 ['What happened to Gary?','He\'s fine. He\'s always fine. He\'ll start a new job tomorrow and quit at 70% again. That\'s the whole business.'],
 [`Do I need ${site.token.ticker} to use RelayWorks?`,`No. ${site.token.ticker} is the community coin. You pay in USDC after you accept the output, and holding the coin isn't required for anything.`],
 ['Where\'s the contract address?',`It gets posted here and on ${site.xHandle} at launch. Nowhere else. If someone DMs you a CA, it's a scam.`],
 ['Is this financial advice?','It\'s a cartoon about a robot with duct tape. No. Memecoins can go to zero. Don\'t spend what you can\'t afford to lose.'],
 ['Can I help build it?',`Code lives at github.com/${site.githubHandle}. Ideas, bugs and partnerships: ${site.email}.`]
];

export function landing(){const live=tokenLive();return `${header()}<main id="main" class="marketing fun">
<section class="f-hero f-wrap">
 <div class="f-hero-copy">
  <span class="f-chip">${icon('bolt')} Episode 1: the 70% problem</span>
  <h1>Your AI agent quit at 70%.<span>Patch finishes the&nbsp;job.</span></h1>
  <p>Gary did 70 rows, hit a weird country code, and fainted. Most teams press restart and pay for all 100 again. RelayWorks hands the last 30 to Patch instead.</p>
  <div class="f-actions"><a class="f-btn f-btn-orange" href="#/app/overview">Open the console ${icon('arrow')}</a><a class="f-btn f-btn-paper" href="#saga">Read the saga</a></div>
  <div class="f-hero-token">${caChip()}<span class="f-hero-meta">${site.token.ticker} · ${site.token.chain} · ${site.token.launchpad}</span></div>
 </div>
 <div class="f-hero-art">${heroScene()}<span class="f-sticker f-sticker-a">70 rows saved ✓</span><span class="f-sticker f-sticker-b">30 left</span></div>
</section>

<section class="f-saga f-wrap" id="saga">
 <div class="f-head" data-reveal><span class="f-kicker">The saga</span><h2>A short story about<br>a very long Tuesday.</h2></div>
 <div class="f-comic">${chapters.map(([k,t,c],i)=>`<figure class="f-panel f-panel-${i+1}" data-reveal><div class="f-panel-art">${panel(i+1)}</div><figcaption><span>${k}</span><strong>${t}</strong><p>${c}</p></figcaption></figure>`).join('')}</div>
</section>

<section class="f-versus f-wrap" id="versus">
 <div class="f-versus-copy" data-reveal><span class="f-kicker">Pick your ending</span><h2>Two ways to clean<br>up after Gary.</h2><p>Same broken job. One option remembers the work that already got done. The other one is a big red button.</p></div>
 <div class="f-versus-card" data-reveal>
  <div class="f-switch" role="group" aria-label="Compare endings"><button data-restart-view="resume" aria-pressed="true" class="selected">Call Patch</button><button data-restart-view="restart" aria-pressed="false">Press restart</button></div>
  <div class="f-versus-number"><strong id="reassignment-number">30</strong><span>rows get<br>done again</span></div>
  <div class="f-rows" id="comparison-blocks">${Array.from({length:20},(_,i)=>`<i class="${i<14?'kept':'assigned'}"></i>`).join('')}</div>
  <div class="f-legend"><span><i></i>70 rows Gary finished</span><span><i></i>30 rows left</span></div>
  <p class="f-versus-caption" id="comparison-caption">Patch keeps Gary's 70 rows and only touches the 30 that broke.</p>
 </div>
</section>

<section class="f-crew" id="crew"><div class="f-wrap">
 <div class="f-head" data-reveal><span class="f-kicker">The crew</span><h2>Heroes, one villain,<br>and Gary.</h2></div>
 <div class="f-cards">${crew.map(([id,name,role,bio,move,weak,stats],i)=>`<article class="f-card f-card-${id}" data-reveal><div class="f-card-top"><span>#00${i+1}</span><span>${role}</span></div><div class="f-card-art">${portrait(id)}</div><h3>${name}</h3><p>${bio}</p><div class="f-stats">${stats.map(([l,v])=>`<div><span>${l}</span><b><i style="width:${v}%"></i></b><em>${v}</em></div>`).join('')}</div><dl><div><dt>Special move</dt><dd>${move}</dd></div><div><dt>Weakness</dt><dd>${weak}</dd></div></dl></article>`).join('')}</div>
</div></section>

<section class="f-how f-wrap" id="how">
 <div class="f-head" data-reveal><span class="f-kicker">How it works</span><h2>Under the jokes,<br>a real product.</h2><p>AI agents break halfway through jobs all the time. RelayWorks saves what they finished and sends only the broken part to a specialist who can fix it.</p></div>
 <ol class="f-steps">${steps.map(([n,t,c,ic])=>`<li data-reveal><span class="f-step-n">${n}</span><span class="f-step-ic">${icon(ic)}</span><h3>${t}</h3><p>${c}</p></li>`).join('')}</ol>
 <div class="f-honest">${icon('info')}<p><strong>Straight talk:</strong> the console is live. Sign in with a wallet, send the leftover work to Patch, and pay in USDC after you accept the output. <a href="#/docs/status">See what works now</a></p></div>
</section>

<section class="f-console-teaser f-wrap">
 <div class="f-teaser-card" data-reveal>
  <div class="f-teaser-copy"><span class="f-kicker">The console</span><h2>Go ahead.<br>Fix Gary's mess.</h2><p>Load the broken job, pick a fixer, and let Patch finish the last 30 rows. You accept the output, then USDC moves.</p><a class="f-btn f-btn-orange" href="#/app/jobs/RW-024">Rescue job RW-024 ${icon('arrow')}</a></div>
  <div class="f-teaser-window" aria-hidden="true"><div class="f-window-bar"><i></i><i></i><i></i><span>relayworks / console</span></div><div class="f-window-body">${[['Customer list cleanup','70%','f-st-orange','Agent fainted'],['Invoice reading · Oct','100%','f-st-yellow','Check my work'],['Product catalog fix','100%','f-st-green','Done, actually'],['Chain event backfill','70%','f-st-orange','Agent fainted']].map(([t,p,c,s])=>`<div class="f-window-row"><strong>${t}</strong><span class="f-mini-bar"><i style="width:${p}"></i></span><em class="${c}">${s}</em></div>`).join('')}<div class="f-window-mascot">${mood('party')}</div></div></div>
 </div>
</section>

<section class="f-token f-wrap" id="relay">
 <div class="f-token-card" data-reveal>
  <div class="f-token-copy"><span class="f-kicker">${site.token.ticker}</span><h2>The coin with<br>a backstory.</h2><p>${site.token.ticker} is the community memecoin for the RelayWorks saga, ${live?'live':'launching'} on ${site.token.launchpad} (${site.token.chain}). Follow along as Patch goes from cartoon to real product.</p>
   <div class="f-token-facts"><div><span>Ticker</span><strong>${site.token.ticker}</strong></div><div><span>Chain</span><strong>${site.token.chain}</strong></div><div><span>Launchpad</span><strong>${site.token.launchpad}</strong></div><div><span>Status</span><strong>${live?'Live':'Coming soon'}</strong></div></div>
   ${caChip('f-ca-big')}
   <div class="f-actions">${live&&site.token.pumpUrl?`<a class="f-btn f-btn-orange" href="${site.token.pumpUrl}" target="_blank" rel="noreferrer">Buy on ${site.token.launchpad} ${icon('arrow')}</a>`:`<a class="f-btn f-btn-orange" href="${site.x}" target="_blank" rel="noreferrer">${xIcon} Follow ${site.xHandle}</a>`}${live&&site.token.dexUrl?`<a class="f-btn f-btn-paper" href="${site.token.dexUrl}" target="_blank" rel="noreferrer">Chart ${icon('arrow')}</a>`:''}<a class="f-btn f-btn-paper" href="#/token">Token page</a></div>
   <p class="f-fine">Only trust the CA posted on ${site.domain} and ${site.xHandle}. ${site.token.ticker} is a memecoin with no promise of profit or utility. Don't spend what you can't afford to lose.</p>
  </div>
  <div class="f-coin" aria-hidden="true"><div class="f-coin-face">${portrait('patch')}</div><span>${site.token.ticker}</span></div>
 </div>
</section>

<section class="f-roadmap f-wrap" id="roadmap">
 <div class="f-head" data-reveal><span class="f-kicker">Season 1</span><h2>The roadmap,<br>in episodes.</h2></div>
 <div class="f-episodes">${episodes.map(([e,t,c,s])=>`<article class="f-ep ${s}" data-reveal><span class="f-ep-tag">${e}${s==='done'?' · aired':s==='next'?' · up next':''}</span><h3>${t}</h3><p>${c}</p></article>`).join('')}</div>
</section>

<section class="f-faq f-wrap" id="questions">
 <div class="f-head" data-reveal><span class="f-kicker">FAQ</span><h2>Questions people<br>actually asked.</h2></div>
 <div class="f-faq-list">${faqs.map(([q,a])=>`<details><summary>${esc(q)}<span>${icon('plus')}</span></summary><p>${esc(a)}</p></details>`).join('')}</div>
</section>

<section class="f-final f-wrap"><div class="f-final-card"><div class="f-final-art">${mood('gary')}</div><h2>Don't press restart.</h2><p>Gary's 70 rows deserve better.</p><div class="f-actions"><a class="f-btn f-btn-orange" href="#/app/overview">Call Patch ${icon('arrow')}</a><a class="f-btn f-btn-paper" href="${site.x}" target="_blank" rel="noreferrer">${xIcon} ${site.xHandle}</a></div></div></section>
</main>${footer()}`}
