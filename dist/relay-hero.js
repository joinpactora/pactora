import {icon} from './ui.js';
export function relayHero(){return `<section class="hero hero-v2 wrap">
  <div class="hero-v2-intro">
    <div><div class="eyebrow"><span class="pill-dot"></span> RECOVERY FOR AI WORKFLOWS</div><h1>An agent stopped.<br><span class="serif-accent">Keep work moving.</span></h1></div>
    <div class="hero-v2-aside"><p class="hero-lede">Recover unfinished tasks with a specialist. <br>Keep the progress, carry the context, and finish from the last good checkpoint.</p><div class="hero-actions"><a href="#/app/overview" class="btn btn-dark">Try a recovery ${icon('arrow')}</a><button class="btn btn-text" data-action="hero-demo">${icon('play')} Watch the handoff</button></div><div class="hero-footnote">Live recovery</div></div>
  </div>
  <div class="engine-experience" id="hero-visual" data-renderer="loading" data-stage="0" aria-label="Interactive checkpoint transfer">
    <img class="model-fallback" src="/assets/relay-engine-poster.webp" width="1920" height="900" fetchpriority="high" alt="Original orange relay gates carrying a glass checkpoint cartridge">
    <canvas class="relay-canvas" tabindex="0" role="img" aria-label="Three-dimensional relay mechanism loading" aria-describedby="scene-description"></canvas>
    <div class="scene-topline"><span><i class="scene-live-dot"></i><span class="scene-mode-label">LOADING INTERACTIVE MODEL</span></span><span>RELAY ENGINE <b>002</b></span></div>
    <div class="scene-callout callout-source"><span class="callout-number">01</span><div><span>SOURCE AGENT</span><strong>Progress, preserved.</strong><small>70 units kept at the checkpoint</small></div><i class="callout-tail"></i></div>
    <div class="scene-callout callout-recovery"><span class="callout-number">02</span><div><span>RECOVERY AGENT / PATCH</span><strong id="scene-dock-label">Ready for the handoff.</strong><small>30 units worth finishing</small></div><i class="callout-tail"></i></div>
    <div class="scene-orbit-hint">${icon('refresh')} Drag to explore <span>·</span> Arrow keys to rotate</div>
    <span class="scene-coordinate coord-left">X / 00.70</span><span class="scene-coordinate coord-right">Y / 01.00</span>
    <p id="scene-description" class="sr-only">An original industrial relay model with orange gate frames, precision rails, machined fittings, and a glass data cartridge. Seven data blocks are preserved. Three remaining blocks are recovered as the cartridge passes to the second agent. USDC moves only after you accept the output.</p>
  </div>
  <div class="engine-toolbar">
    <div class="engine-steps" role="group" aria-label="3D recovery stages">${['Capture','Match','Resume','Verify'].map((label,i)=>`<button class="engine-step ${i===0?'selected':''}" data-action="engine-stage" data-step="${i}" aria-pressed="${i===0}"><span>0${i+1}</span>${label}<i></i></button>`).join('')}</div>
    <div class="engine-controls"><button class="engine-control" data-action="engine-pause" aria-label="Pause animation">${icon('pause')}<span>Pause</span></button><button class="engine-control" data-action="engine-inspect" aria-pressed="false">${icon('grid')}<span>Inspect</span></button><a class="engine-control" href="/assets/relay-engine.glb" download aria-label="Download the 3D relay model">${icon('download')}<span>Model</span></a></div>
  </div>
  <div class="engine-recovery-strip">
    <div class="strip-job"><span class="mini-job-icon">${icon('file')}</span><div><strong>Customer dataset enrichment</strong><span>LIVE RECOVERY / RW-024</span></div></div>
    <div class="strip-state"><span class="status orange" id="hero-status"><i></i>Checkpoint captured</span><span id="hero-remaining">70 preserved · 30 remaining</span></div>
    <div class="strip-progress"><div><span>RECOVERY PROGRESS</span><strong><span id="hero-completed">70</span><small> / 100</small></strong></div><div class="hero-progress"><span id="hero-progress-fill"></span></div></div>
  </div>
</section>`}
