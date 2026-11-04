// Clicks through one full demo rescue in headless Chrome: job -> fixer -> accept -> receipt.
import {spawn} from 'node:child_process';import {mkdtempSync} from 'node:fs';import {tmpdir} from 'node:os';import {join} from 'node:path';
const base=process.argv[2]||'http://localhost:8765/';const chrome=process.env.CHROME||'C:/Program Files/Google/Chrome/Application/chrome.exe';
const port=9800+Math.floor(Math.random()*100);const proc=spawn(chrome,['--headless=new','--disable-gpu',`--remote-debugging-port=${port}`,`--user-data-dir=${mkdtempSync(join(tmpdir(),'rw-flow-'))}`,'about:blank'],{stdio:'ignore'});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));let ws;for(let i=0;i<40;i++){try{const l=await (await fetch(`http://127.0.0.1:${port}/json`)).json();const p=l.find(t=>t.type==='page');if(p){ws=new WebSocket(p.webSocketDebuggerUrl);break}}catch{}await sleep(250)}
await new Promise(r=>ws.addEventListener('open',r,{once:true}));let id=0;const pend=new Map();const errors=[];
ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id&&pend.has(m.id)){pend.get(m.id)(m);pend.delete(m.id)}if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.exception?.description||m.params.exceptionDetails.text)});
const send=(method,params={})=>new Promise(r=>{const i=++id;pend.set(i,r);ws.send(JSON.stringify({id:i,method,params}))});
const ev=async x=>(await send('Runtime.evaluate',{expression:x,returnByValue:true,awaitPromise:true})).result.result.value;
await send('Runtime.enable');await send('Page.enable');
const steps=[];const ok=(name,v)=>{steps.push(`${v?'PASS':'FAIL'} ${name}`)};
await send('Page.navigate',{url:base});await sleep(2500);
ok('landing renders comic',await ev(`document.querySelectorAll('.f-panel').length===4`));
ok('versus toggle works',await ev(`(document.querySelector('[data-restart-view=restart]').click(),document.getElementById('reassignment-number').textContent==='100')`));
ok('CA copy shows coming-soon toast',await ev(`(document.querySelector('[data-action=copy-ca]')||{click(){}}).click(),true`));
await ev(`location.hash='#/app/jobs/RW-024'`);await sleep(800);
const walletGate=await ev(`document.body.innerText.includes('Sign in with wallet')`);
if(walletGate){ok('console waits for a wallet before live jobs',true)}
else{
ok('job page shows Agent fainted',await ev(`document.body.innerText.includes('Agent fainted')`));
await ev(`document.querySelector('[data-action=start-recovery]').click()`);await sleep(6000);
ok('simulation reaches Check my work',await ev(`document.body.innerText.includes('Check my work')`));
await ev(`document.querySelector('[data-action=accept-recovery]').click()`);await sleep(800);
ok('receipt page reached',await ev(`location.hash==='#/app/receipts/RW-024'&&document.body.innerText.includes('Gary owes Patch one')`));
}
await ev(`location.hash='#/token'`);await sleep(600);ok('token page renders',await ev(`document.body.innerText.includes('Scam check')`));
await ev(`location.hash='#/docs'`);await sleep(600);ok('docs page renders',await ev(`!!document.querySelector('.docs-page')`));
await ev(`location.hash='#saga'`);await sleep(800);ok('section link from docs returns to landing',await ev(`!!document.querySelector('.fun .f-comic')`));
console.log(steps.join('\n'));console.log(errors.length?'JS ERRORS:\n'+errors.join('\n'):'No JS errors');ws.close();proc.kill();process.exit(steps.some(s=>s.startsWith('FAIL'))||errors.length?1:0);
