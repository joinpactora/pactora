// Usage: node scripts/mobile-shot.mjs <url> <out.png> [width] [height]
// Emulates a phone viewport through the Chrome DevTools protocol and reports horizontal overflow.
import {spawn} from 'node:child_process';
import {writeFileSync,mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
const [url,out,w='390',h='844']=process.argv.slice(2);
const chrome=process.env.CHROME||'C:/Program Files/Google/Chrome/Application/chrome.exe';
const port=9300+Math.floor(Math.random()*500);
const proc=spawn(chrome,['--headless=new','--disable-gpu','--hide-scrollbars','--force-prefers-reduced-motion',`--remote-debugging-port=${port}`,`--user-data-dir=${mkdtempSync(join(tmpdir(),'rw-cdp-'))}`,'about:blank'],{stdio:'ignore'});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let ws;for(let i=0;i<40;i++){try{const list=await (await fetch(`http://127.0.0.1:${port}/json`)).json();const page=list.find(t=>t.type==='page');if(page){ws=new WebSocket(page.webSocketDebuggerUrl);break}}catch{}await sleep(250)}
await new Promise(r=>ws.addEventListener('open',r,{once:true}));
let id=0;const pending=new Map();
ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id&&pending.has(m.id)){pending.get(m.id)(m);pending.delete(m.id)}});
const send=(method,params={})=>new Promise(r=>{const i=++id;pending.set(i,r);ws.send(JSON.stringify({id:i,method,params}))});
await send('Emulation.setDeviceMetricsOverride',{width:+w,height:+h,deviceScaleFactor:1,mobile:true});
await send('Page.enable');await send('Runtime.enable');
await send('Page.navigate',{url});await sleep(3500);
const metrics=await send('Runtime.evaluate',{expression:`JSON.stringify({scrollWidth:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight,wide:[...document.querySelectorAll('body *')].filter(el=>{const r=el.getBoundingClientRect();return r.right>innerWidth+1&&getComputedStyle(el).position!=='fixed'}).slice(0,8).map(el=>el.tagName+'.'+String(el.className?.baseVal??el.className).slice(0,40)+' '+Math.round(el.getBoundingClientRect().right))})`,returnByValue:true});
const info=JSON.parse(metrics.result.result.value);console.log(JSON.stringify(info));
const full=Math.min(info.height,16000);
await send('Emulation.setDeviceMetricsOverride',{width:+w,height:full,deviceScaleFactor:1,mobile:true});await sleep(800);
const shot=await send('Page.captureScreenshot',{format:'png'});
writeFileSync(out,Buffer.from(shot.result.data,'base64'));
ws.close();proc.kill();process.exit(0);
