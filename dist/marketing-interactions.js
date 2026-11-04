export function mountMarketing(root){
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function click(e){
    const preview=null;
    if(preview){const mode=preview.dataset.previewView;root.querySelectorAll('[data-preview-view]').forEach(b=>{const active=b===preview;b.classList.toggle('selected',active);b.setAttribute('aria-selected',String(active))});const panel=root.querySelector('#workspace-preview');panel.innerHTML=workspacePreview(mode);panel.setAttribute('aria-labelledby',preview.id)}
    const compare=e.target.closest('[data-restart-view]');
    if(compare){const restart=compare.dataset.restartView==='restart';root.querySelectorAll('[data-restart-view]').forEach(b=>{const active=b===compare;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',String(active))});root.querySelector('#reassignment-number').textContent=restart?'100':'30';root.querySelector('#comparison-blocks').classList.toggle('restart',restart);root.querySelector('#comparison-caption').textContent=restart?'The Restart Button deletes Gary’s 70 good rows and redoes all 100. You pay for every single one. Again.':'Patch keeps Gary’s 70 rows and only touches the 30 that broke.'}
  }
  function keydown(e){const tab=e.target.closest('[data-preview-view]');if(e.ctrlKey||e.metaKey||e.altKey||!tab||!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const tabs=[...root.querySelectorAll('[data-preview-view]')],index=tabs.indexOf(tab);const next=e.key==='Home'?0:e.key==='End'?tabs.length-1:(index+(e.key==='ArrowRight'?1:tabs.length-1))%tabs.length;tabs[next].click();tabs[next].focus()}
  let raf=0;
  function updateProgress(){raf=0;const bar=document.getElementById('reading-progress');if(!bar)return;const available=document.documentElement.scrollHeight-innerHeight;bar.style.transform=`scaleX(${available>0?Math.max(0,Math.min(1,scrollY/available)):0})`}
  function scroll(){if(!raf)raf=requestAnimationFrame(updateProgress)}
  const reveal=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');reveal.unobserve(e.target)}}),{threshold:.08});
  if(!reduced)root.querySelectorAll('[data-reveal]').forEach(el=>{el.classList.add('reveal-ready');reveal.observe(el)});
  root.addEventListener('click',click);root.addEventListener('keydown',keydown);window.addEventListener('scroll',scroll,{passive:true});updateProgress();
  return ()=>{reveal.disconnect();root.removeEventListener('click',click);root.removeEventListener('keydown',keydown);window.removeEventListener('scroll',scroll);if(raf)cancelAnimationFrame(raf)};
}
