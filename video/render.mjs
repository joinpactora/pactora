// Renders video/intro.html frame by frame in headless Chrome and pipes the frames into ffmpeg.
// Usage: node video/render.mjs <baseUrl> <ffmpeg> <out.mp4> <startFrame> <endFrame>
//        node video/render.mjs <baseUrl> stills <outDir> t1,t2,...   (PNG stills for review)
import {spawn} from 'node:child_process';import {mkdtempSync,writeFileSync} from 'node:fs';import {tmpdir} from 'node:os';import {join} from 'node:path';
const [base,ffmpeg,out,a,b]=process.argv.slice(2);
const chrome=process.env.CHROME||'C:/Program Files/Google/Chrome/Application/chrome.exe';
const port=9300+Math.floor(Math.random()*600);
const proc=spawn(chrome,['--headless=new','--hide-scrollbars','--force-device-scale-factor=1','--window-size=1920,1080',`--remote-debugging-port=${port}`,`--user-data-dir=${mkdtempSync(join(tmpdir(),'rw-vid-'))}`,'about:blank'],{stdio:'ignore'});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));let ws;
for(let i=0;i<60;i++){try{const l=await (await fetch(`http://127.0.0.1:${port}/json`)).json();const p=l.find(t=>t.type==='page');if(p){ws=new WebSocket(p.webSocketDebuggerUrl);break}}catch{}await sleep(250)}
await new Promise(r=>ws.addEventListener('open',r,{once:true}));let id=0;const pend=new Map();
ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id&&pend.has(m.id)){pend.get(m.id)(m);pend.delete(m.id)}if(m.method==='Runtime.exceptionThrown')console.error('JS',JSON.stringify(m.params.exceptionDetails).slice(0,600))});
const send=(method,params={})=>new Promise(r=>{const i=++id;pend.set(i,r);ws.send(JSON.stringify({id:i,method,params}))});
const ev=async x=>{const r=await send('Runtime.evaluate',{expression:x,returnByValue:true,awaitPromise:true});if(r.result?.exceptionDetails)console.error('EVAL',JSON.stringify(r.result.exceptionDetails).slice(0,600));return r.result?.result?.value};
await send('Runtime.enable');await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride',{width:1920,height:1080,deviceScaleFactor:1,mobile:false});
await send('Page.navigate',{url:base+'video/intro.html?render=1'});
for(let i=0;i<80;i++){await sleep(250);if(await ev(`window.__ready?window.__ready.then(()=>true):false`))break}
const shot=async(t,fmt)=>{await ev(`(seek(${t}),new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))))`);const r=await send('Page.captureScreenshot',{format:fmt,quality:fmt==='jpeg'?94:undefined,clip:{x:0,y:0,width:1920,height:1080,scale:1}});return Buffer.from(r.result.data,'base64')};
if(ffmpeg==='stills'){for(const t of a.split(',')){writeFileSync(join(out,`still-${t}.png`),await shot(+t,'png'));console.log('still',t)}}
else{
 const fps=30,s=+a,e=+b;
 const ff=spawn(ffmpeg,['-y','-loglevel','error','-f','image2pipe','-framerate',String(fps),'-c:v','mjpeg','-i','-','-c:v','libx264','-preset','medium','-crf','17','-pix_fmt','yuv420p','-r',String(fps),out],{stdio:['pipe','inherit','inherit']});
 const t0=Date.now();
 for(let f=s;f<e;f++){const buf=await shot(f/fps,'jpeg');if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r));if((f-s)%150===0)console.log(`[${s}-${e}] frame ${f} ${((Date.now()-t0)/1000).toFixed(0)}s`)}
 ff.stdin.end();await new Promise(r=>ff.on('close',r));console.log('done',out,((Date.now()-t0)/1000).toFixed(0)+'s');
}
ws.close();proc.kill();process.exit(0);
