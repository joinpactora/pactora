import {icon} from './ui.js';
const chapters=[
  {name:'Capture',tag:'KEEP THE HEAD START',title:'Progress worth\npicking up.',copy:'Patch lifts the last good checkpoint. The clean records, source files, and acceptance checks travel together.',metric:'70',unit:'records preserved',event:'Checkpoint secured',detail:'30 unfinished records stay clearly marked.'},
  {name:'Match',tag:'FIND THE RIGHT FINISHER',title:'The right hands.\nThe right context.',copy:'A specialist steps in with the capability to finish the job. Task, scope, and budget stay attached to the handoff.',metric:'01',unit:'scoped handoff',event:'Specialist selected',detail:'Patch · 6.40 USDC quote.'},
  {name:'Resume',tag:'ONLY WHAT REMAINS',title:'Open it. Repair it.\nKeep moving.',copy:'Patch opens the cartridge and repairs the unfinished units. The 70 completed records remain part of the final output.',metric:'30',unit:'records to recover',event:'Recovery in motion',detail:'Repair the remainder. Preserve the original work.'},
  {name:'Verify',tag:'FINISHED MEANS CHECKED',title:'Good work.\nCarried through.',copy:'The result is checked against the agreed criteria. Patch closes the checkpoint and hands back a traceable recovery receipt.',metric:'100',unit:'records complete',event:'Acceptance checks passed',detail:'Schema · count · uniqueness · preservation.'}
];
export function recoveryJourney(){return `<section class="recovery-journey" id="product" aria-labelledby="journey-heading">
  <div class="journey-intro marketing-wrap"><div class="section-label"><span>02</span> THE RECOVERY, IN MOTION</div><h2 id="journey-heading">A handoff you can <em>follow.</em></h2><p>One interrupted job. Four deliberate moves.<br>Scroll to put Patch to work.</p><a href="#workspace" class="journey-skip">Skip to the workspace ${icon('down')}</a></div>
  <div class="journey-track" id="journey-track">
    <div class="journey-sticky">
      <div class="journey-topline"><span><i></i> RELAYWORKS / RECOVERY WORKSHOP</span><span>RW-024 · LIVE WORKFLOW</span></div>
      <div class="journey-content">
        <div class="journey-copy" id="journey-copy">${chapters.map((s,i)=>`<article class="journey-chapter" data-chapter="${i}" ${i?'hidden':''}><span class="journey-eyebrow">0${i+1} / 04 <i></i> ${s.tag}</span><h3>${s.title.replace('\n','<br>')}</h3><p>${s.copy}</p><div class="journey-metric"><strong>${s.metric}</strong><span>${s.unit}<small>Customer dataset enrichment</small></span></div><div class="journey-event">${icon(i===3?'shield':i===2?'refresh':i===1?'network':'folder')}<div><strong>${s.event}</strong><span>${s.detail}</span></div></div><a href="#/app/jobs/RW-024">Explore the sample recovery ${icon('arrow')}</a></article>`).join('')}</div>
        <div class="journey-visual-wrap">
          <div class="journey-floor" aria-hidden="true"></div><div class="journey-orbital" aria-hidden="true"><span></span><i>RW / 024</i></div>
          <div class="mascot-stage journey-stage" id="journey-visual" data-stage="0" data-renderer="loading">
            <img class="model-fallback" src="/assets/patch-motion/frame-000.webp" width="640" height="640" loading="lazy" alt="Patch lifting a checkpoint, ready to preserve the completed work">
            <canvas class="relay-canvas" role="img" aria-label="Patch acts out the recovery as you scroll. Scroll backward to reverse the sequence."></canvas>
          </div>
          <div class="journey-object-label"><span class="journey-status-dot"></span><strong id="journey-object-title">CHECKPOINT / CAPTURED</strong><span id="journey-object-subtitle">70 preserved + 30 unfinished</span></div>
          <div class="journey-scene-index" aria-hidden="true"><span>PATCH / SPECIALIST 01</span><strong id="journey-frame-index">001</strong><span>SCROLL TO CONTINUE ${icon('down')}</span></div>
        </div>
      </div>
      <div class="journey-controls"><div class="journey-nav" role="group" aria-label="Jump to a recovery chapter">${chapters.map((s,i)=>`<button data-journey-step="${i}" aria-pressed="${i===0}"><span>0${i+1}</span><strong>${s.name}</strong>${icon(i===3?'shield':'right')}<i></i></button>`).join('')}</div><div class="journey-bottom"><span>LIVE RECOVERY · PAY AFTER ACCEPTANCE</span><button data-journey-motion aria-pressed="false">${icon('pause')}<span>Reduce motion</span></button><span class="journey-scroll-cue">YOUR SCROLL. PATCH’S NEXT MOVE. ${icon('down')}</span></div></div>
      <div class="journey-scrub-line"><i></i></div>
    </div>
  </div>
</section>`}

export function mountJourney(section,scene){
  const track=section.querySelector('.journey-track'),sticky=section.querySelector('.journey-sticky');
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  const toggle=section.querySelector('[data-journey-motion]');
  let reduced=media.matches,frame=0,lastStage=-1,start=0,range=1,disposed=false;
  function measure(){const header=document.querySelector('.site-header');const top=header?.getBoundingClientRect().height||0;start=track.getBoundingClientRect().top+scrollY-top;range=Math.max(1,track.offsetHeight-sticky.offsetHeight);update()}
  function mode(){section.dataset.reduced=String(reduced);toggle.setAttribute('aria-pressed',String(reduced));toggle.innerHTML=icon(reduced?'play':'pause')+'<span>'+(reduced?'Enable full motion':'Reduce motion')+'</span>';scene.setReduced(reduced);update()}
  function update(){
    frame=0;if(disposed)return;const p=Math.max(0,Math.min(1,(scrollY-start)/range)),i=Math.min(3,Math.floor(p*4));
    scene.setProgress(reduced?Math.min(.99,(i+.5)/4):p);
    section.dataset.progress=p.toFixed(4);section.style.setProperty('--journey-progress',String(p));
    section.querySelector('#journey-frame-index').textContent=String(Math.round(p*999)).padStart(3,'0');
    section.querySelectorAll('[data-journey-step]').forEach((b,n)=>b.style.setProperty('--chapter-progress',String(Math.max(0,Math.min(1,p*4-n)))));
    if(lastStage!==i){lastStage=i;section.dataset.chapter=String(i);section.querySelectorAll('[data-chapter]').forEach((el,n)=>el.hidden=n!==i);section.querySelectorAll('[data-journey-step]').forEach((b,n)=>b.setAttribute('aria-pressed',String(n===i)));section.querySelector('#journey-object-title').textContent=['CHECKPOINT / CAPTURED','SPECIALIST / MATCHED','RECOVERY / IN PROGRESS','OUTPUT / VERIFIED'][i];section.querySelector('#journey-object-subtitle').textContent=['70 preserved + 30 unfinished','Scoped context. Explicit budget.','Repairing the remaining units','100 complete. A clear receipt.'][i]}
  }
  function scroll(){if(!frame)frame=requestAnimationFrame(update)}
  function go(i){window.scrollTo({top:start+range*(i+.45)/4,behavior:reduced?'instant':'smooth'})}
  function click(e){const b=e.target.closest('[data-journey-step]');if(b)go(Number(b.dataset.journeyStep));if(e.target.closest('[data-journey-motion]')){reduced=!reduced;mode()}}
  function key(e){const b=e.target.closest('[data-journey-step]');if(e.ctrlKey||e.metaKey||e.altKey||!b||!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const n=Number(b.dataset.journeyStep),i=e.key==='Home'?0:e.key==='End'?3:(n+(e.key==='ArrowRight'?1:3))%4;section.querySelector(`[data-journey-step="${i}"]`).focus();go(i)}
  function preference(){reduced=media.matches;mode()}
  const resize=new ResizeObserver(measure);resize.observe(track);resize.observe(sticky);
  window.addEventListener('scroll',scroll,{passive:true});window.addEventListener('resize',measure);media.addEventListener('change',preference);section.addEventListener('click',click);section.addEventListener('keydown',key);
  mode();measure();document.fonts?.ready.then(()=>{if(!disposed)measure()});
  return {goTo:go,dispose(){disposed=true;if(frame)cancelAnimationFrame(frame);resize.disconnect();window.removeEventListener('scroll',scroll);window.removeEventListener('resize',measure);media.removeEventListener('change',preference);section.removeEventListener('click',click);section.removeEventListener('keydown',key);scene.dispose()}};
}

export function mountHeroScroll(host,scene){
  const hero=host.closest('.hero-v3'),media=matchMedia('(prefers-reduced-motion: reduce)');let frame=0;
  function update(){frame=0;const b=hero.getBoundingClientRect(),p=Math.max(0,Math.min(1,-b.top/Math.max(1,b.height*.8)));scene.setProgress(media.matches?.17:.17+p*.22)}
  function scroll(){if(!frame)frame=requestAnimationFrame(update)}
  function preference(){scene.setReduced(media.matches);update()}
  const resize=new ResizeObserver(update);resize.observe(hero);window.addEventListener('scroll',scroll,{passive:true});media.addEventListener('change',preference);update();
  return ()=>{resize.disconnect();window.removeEventListener('scroll',scroll);media.removeEventListener('change',preference);if(frame)cancelAnimationFrame(frame)};
}
