import {icon} from './ui.js';
export function specialistHero(){return `<section class="hero-v3" aria-labelledby="hero-title">
  <div class="hero-v3-copy">
    <div class="hero-kicker"><span class="pill-dot"></span> THE AGENT RECOVERY NETWORK</div>
    <h1 id="hero-title">AI work.<br><span>Back in motion.</span></h1>
    <p>When an AI workflow breaks, hand its last good checkpoint to a specialist. Preserve the progress. Finish the job.</p>
    <div class="hero-v3-actions"><a class="btn btn-orange" href="#/app/overview">Explore the workspace ${icon('arrow')}</a><button class="hero-film" data-action="hero-demo"><span>${icon('down')}</span>Scroll the recovery</button></div>
    <div class="hero-proof"><span>${icon('shield')} Checkpoint-first</span><span>${icon('wallet')} Budget-bound</span><span>${icon('check')} Verification-led</span></div>
    <div class="hero-build-note"><span class="build-signal"></span><span>RelayWorks is live.<br><a href="#/docs/status">See what’s available today ${icon('right')}</a></span></div>
  </div>
  <div class="hero-v3-visual">
    <div class="mascot-stage" id="hero-visual" data-renderer="loading" data-stage="0" aria-label="Patch illustrates a checkpoint recovery">
      <div class="stage-grid" aria-hidden="true"></div>
      <img class="model-fallback" src="/assets/patch-motion/frame-008.webp" width="640" height="640" fetchpriority="high" alt="Patch, an original ivory and orange recovery robot, lifting a glass checkpoint cartridge">
      <canvas class="relay-canvas" role="img" aria-label="Patch recovery specialist animated by page scroll" aria-describedby="scene-description"></canvas>
      <div class="stage-caption"><span class="scene-mode-label">MEET PATCH</span><span>RECOVERY SPECIALIST <i>01</i></span></div>
      <div class="floating-checkpoint"><span class="checkpoint-icon">${icon('folder')}</span><div><small>LAST GOOD CHECKPOINT</small><strong>Your progress is safe.</strong><span>70 of 100 records preserved</span></div><i>${icon('check')}</i></div>
      <div class="patch-nameplate"><span class="patch-name-dot"></span><div><strong>Patch</strong><span id="scene-dock-label">Ready for the handoff.</span></div>${icon('arrow')}</div>
      <div class="scene-orbit-hint">${icon('down')} Your scroll puts Patch to work.</div>
      <p class="sr-only" id="scene-description">Patch is an original articulated 3D robot. Page scroll drives the movement. Follow the four-chapter recovery workshop below to lift the checkpoint, carry it to a specialist, repair the unfinished units, and verify the output. The sequence shows the recovery.</p>
    </div>
    <div class="hero-recovery-card"><div class="sample-indicator"><span></span> ONE JOB. A SECOND CHANCE.</div><div class="hero-recovery-row"><div><strong>Customer dataset enrichment</strong><span>RW-024 / Live recovery</span></div><span class="status orange" id="hero-status"><i></i>Checkpoint captured</span></div><div class="hero-recovery-bottom"><div><span id="hero-remaining">70 preserved · 30 remaining</span><div class="hero-progress"><span id="hero-progress-fill"></span></div></div><strong><span id="hero-completed">70</span><small>/100</small></strong></div></div>
  </div>
  <div class="hero-bottom"><span>GOOD WORK DESERVES A WAY FORWARD.</span><a href="#product">Explore the recovery layer ${icon('down')}</a><span class="hero-edition">RELAYWORKS / FIELD NOTES 001</span></div>
</section>`}
