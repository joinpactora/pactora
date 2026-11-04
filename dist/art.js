// RelayWorks cartoon kit. Every character and scene is hand-built SVG.
export const C={ink:'#1d1a16',orange:'#ef6339',cream:'#fff8ec',mint:'#9ff0d0',yellow:'#ffd23f',blue:'#5b8def',green:'#5fbf7a',red:'#e8453c',grey:'#b8c0cb',pink:'#ffb3c1',paper:'#fdf3df',wood:'#c98b5a',dark:'#3a3530'};
const FONT=`font-family="'Lilita One',system-ui,sans-serif"`;
const st=(w=4)=>`stroke="${C.ink}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const wob=`<defs><filter id="rw-wob" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7"/><feDisplacementMap in="SourceGraphic" scale="2.2"/></filter></defs>`;
const svg=(w,h,body,label,cls='')=>`<svg class="rw-art ${cls}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">${wob}<g filter="url(#rw-wob)">${body}</g></svg>`;

function limb(d,color){return `<path d="${d}" fill="none" stroke="${C.ink}" stroke-width="20" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${color}" stroke-width="12" stroke-linecap="round"/>`}
const hand=(x,y)=>`<circle cx="${x}" cy="${y}" r="9" fill="${C.cream}" ${st(4)}/>`;
const ARMS={
 down:[['M62 132Q44 160 50 186',50,186],['M138 132Q156 160 150 186',150,186]],
 hold:[['M62 132Q50 168 84 172',84,172],['M138 132Q150 168 116 172',116,172]],
 type:[['M62 132Q52 176 80 182',80,182],['M138 132Q148 176 120 182',120,182]],
 wave:[['M62 132Q44 160 50 186',50,186],['M138 132Q172 112 168 74',168,74]],
 up:[['M62 132Q32 110 36 72',36,72],['M138 132Q168 110 164 72',164,72]],
 point:[['M62 132Q44 160 50 186',50,186],['M138 132Q170 140 190 124',190,124]]
};
const FACES={
 happy:m=>`<rect x="72" y="60" width="14" height="20" rx="4" fill="${m}"/><rect x="114" y="60" width="14" height="20" rx="4" fill="${m}"/><path d="M82 90Q100 102 118 90" fill="none" stroke="${m}" stroke-width="5" stroke-linecap="round"/>`,
 grin:m=>`<path d="M70 74Q79 62 88 74M112 74Q121 62 130 74" fill="none" stroke="${m}" stroke-width="5" stroke-linecap="round"/><path d="M82 84H118Q116 102 100 102Q84 102 82 84Z" fill="${m}"/>`,
 dead:m=>`<path d="M70 60 88 78M88 60 70 78M112 60 130 78M130 60 112 78" stroke="${m}" stroke-width="5" stroke-linecap="round"/><path d="M82 94Q91 87 100 94T118 94" fill="none" stroke="${m}" stroke-width="5" stroke-linecap="round"/><path d="M104 96q2 10 8 8t2-8" fill="${C.pink}" stroke="${m}" stroke-width="3"/>`,
 determined:m=>`<path d="M68 58 90 65M132 58 110 65" stroke="${m}" stroke-width="5" stroke-linecap="round"/><rect x="72" y="67" width="14" height="13" rx="4" fill="${m}"/><rect x="114" y="67" width="14" height="13" rx="4" fill="${m}"/><path d="M86 93Q104 99 118 88" fill="none" stroke="${m}" stroke-width="5" stroke-linecap="round"/>`,
 sleep:m=>`<path d="M70 72Q79 79 88 72M112 72Q121 79 130 72" fill="none" stroke="${m}" stroke-width="5" stroke-linecap="round"/><circle cx="100" cy="92" r="5" fill="none" stroke="${m}" stroke-width="4"/>`,
 wink:m=>`<rect x="72" y="60" width="14" height="20" rx="4" fill="${m}"/><path d="M112 72Q121 62 130 72" fill="none" stroke="${m}" stroke-width="5" stroke-linecap="round"/><path d="M82 88Q100 104 120 86" fill="none" stroke="${m}" stroke-width="5" stroke-linecap="round"/>`,
 smug:m=>`<path d="M70 70H88M112 70H130" stroke="${m}" stroke-width="5" stroke-linecap="round"/><rect x="73" y="70" width="12" height="8" rx="3" fill="${m}"/><rect x="115" y="70" width="12" height="8" rx="3" fill="${m}"/><path d="M84 92Q104 96 120 84" fill="none" stroke="${m}" stroke-width="5" stroke-linecap="round"/>`,
 panic:m=>`<circle cx="79" cy="70" r="9" fill="none" stroke="${m}" stroke-width="5"/><circle cx="121" cy="70" r="9" fill="none" stroke="${m}" stroke-width="5"/><ellipse cx="100" cy="95" rx="8" ry="7" fill="${m}"/>`
};
const ITEMS={
 tape:`<circle cx="100" cy="168" r="20" fill="#cfd4da" ${st(4)}/><circle cx="100" cy="168" r="8" fill="${C.cream}" ${st(3)}/><path d="M117 178q14 12 6 32l-11-3q5-14-5-22Z" fill="#cfd4da" ${st(3)}/>`,
 papers:`<g transform="rotate(-6 100 168)"><rect x="74" y="150" width="52" height="40" rx="3" fill="#fff" ${st(4)}/><rect x="70" y="144" width="52" height="40" rx="3" fill="#fff" ${st(4)}/><path d="M78 156h34M78 164h28M78 172h32" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/></g>`,
 magnifier:`<path d="M126 196 146 220" stroke="${C.ink}" stroke-width="12" stroke-linecap="round"/><path d="M126 196 146 220" stroke="${C.wood}" stroke-width="6" stroke-linecap="round"/><circle cx="110" cy="176" r="22" fill="rgba(160,220,255,.45)" ${st(5)}/><path d="M98 166q6-6 14-4" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>`,
 coffee:`<rect x="138" y="168" width="26" height="28" rx="5" fill="#fff" ${st(4)}/><path d="M164 174q12 0 10 10t-10 8" fill="none" ${st(4)}/><path d="M146 160q-4-8 2-14M156 160q-4-8 2-14" fill="none" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/>`
};
const ACC={
 bandaid:`<g transform="rotate(-28 142 40)"><rect x="122" y="33" width="42" height="15" rx="7.5" fill="#f6c28b" ${st(3)}/><rect x="137" y="33" width="12" height="15" fill="#e9a464" stroke="${C.ink}" stroke-width="3"/><circle cx="128" cy="40.5" r="1.4" fill="${C.ink}"/><circle cx="158" cy="40.5" r="1.4" fill="${C.ink}"/></g>`,
 bandaid2:`<g transform="rotate(20 70 160)"><rect x="56" y="154" width="32" height="12" rx="6" fill="#f6c28b" ${st(3)}/><rect x="67" y="154" width="10" height="12" fill="#e9a464" stroke="${C.ink}" stroke-width="3"/></g>`,
 tie:`<path d="M93 122h14l-3 8 6 36-10 10-10-10 6-36Z" fill="${C.red}" ${st(3)}/>`,
 glasses:`<circle cx="79" cy="72" r="19" fill="rgba(255,255,255,.16)" ${st(5)}/><circle cx="121" cy="72" r="19" fill="rgba(255,255,255,.16)" ${st(5)}/><path d="M98 70h4" ${st(5)}/>`,
 cap:`<path d="M44 46Q48 10 100 10t56 36Z" fill="${C.blue}" ${st(4)}/><path d="M150 44q30 0 34 10l-36 2Z" fill="${C.blue}" ${st(4)}/>`,
 sweat:`<path d="M170 44q8 12 0 16t0-16Z" fill="#8fd3ff" ${st(3)}/>`
};

// One cartoon robot. Local box is 200x240 with feet on y≈228.
export function bot({body=C.orange,head=C.cream,screen=C.ink,eye=C.mint,face='happy',arms='down',item='',acc=[],antenna=C.orange,round=false,shadow=true}={}){
 const a=ARMS[arms]||ARMS.down;
 return `${shadow?`<ellipse cx="100" cy="230" rx="62" ry="8" fill="rgba(29,26,22,.14)"/>`:''}
 <rect x="74" y="184" width="14" height="30" fill="${C.ink}"/><rect x="112" y="184" width="14" height="30" fill="${C.ink}"/>
 <rect x="56" y="206" width="42" height="22" rx="11" fill="${body}" ${st()}/><rect x="102" y="206" width="42" height="22" rx="11" fill="${body}" ${st()}/>
 <rect x="58" y="116" width="84" height="74" rx="22" fill="${body}" ${st()}/>
 <rect x="80" y="134" width="40" height="26" rx="7" fill="${C.cream}" ${st(3)}/><path d="M87 152v-6M95 152v-10M103 152v-4M111 152v-8" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/>
 ${acc.includes('tie')?ACC.tie:''}${acc.includes('bandaid2')?ACC.bandaid2:''}
 <path d="M100 30V14" ${st()}/><circle cx="100" cy="11" r="7" fill="${antenna}" ${st()}/>
 <circle cx="37" cy="76" r="11" fill="${body}" ${st()}/><circle cx="163" cy="76" r="11" fill="${body}" ${st()}/>
 <rect x="40" y="28" width="120" height="94" rx="${round?46:24}" fill="${head}" ${st()}/>
 <rect x="54" y="44" width="92" height="62" rx="${round?30:14}" fill="${screen}" ${st(3)}/>
 <path d="M60 52q4-4 10-4" stroke="rgba(255,255,255,.35)" stroke-width="4" fill="none" stroke-linecap="round"/>
 ${(FACES[face]||FACES.happy)(eye)}
 ${acc.includes('glasses')?ACC.glasses:''}${acc.includes('bandaid')?ACC.bandaid:''}${acc.includes('cap')?ACC.cap:''}${acc.includes('sweat')?ACC.sweat:''}
 ${item==='coffee'?ITEMS.coffee:''}
 ${limb(a[0][0],body)}${limb(a[1][0],body)}
 ${item&&item!=='coffee'?ITEMS[item]:''}
 ${hand(a[0][1],a[0][2])}${hand(a[1][1],a[1][2])}`;
}
export const patchBot=(o={})=>bot({face:'determined',arms:'hold',item:'tape',acc:['bandaid','bandaid2'],...o});
export const garyBot=(o={})=>bot({body:'#8b97a8',head:'#e8ecf1',antenna:C.blue,eye:'#bfe1ff',round:true,acc:['tie'],...o});
export const atlasBot=(o={})=>bot({body:C.green,antenna:C.yellow,face:'smug',arms:'hold',item:'papers',acc:['glasses'],...o});
export const menderBot=(o={})=>bot({body:C.blue,antenna:C.red,face:'happy',arms:'hold',item:'magnifier',acc:['cap'],...o});

export function restartVillain(){
 return `<ellipse cx="100" cy="226" rx="84" ry="10" fill="rgba(29,26,22,.14)"/>
 <path d="M20 168v40a80 20 0 0 0 160 0v-40Z" fill="${C.dark}" ${st()}/><ellipse cx="100" cy="168" rx="80" ry="20" fill="#57504a" ${st()}/>
 <path d="M36 166Q36 64 100 64t64 102Z" fill="${C.red}" ${st()}/><path d="M56 120q6-30 30-40" stroke="rgba(255,255,255,.55)" stroke-width="8" fill="none" stroke-linecap="round"/>
 <path d="M66 108 92 120M134 108 108 120" stroke="${C.ink}" stroke-width="7" stroke-linecap="round"/>
 <circle cx="82" cy="128" r="7" fill="${C.ink}"/><circle cx="118" cy="128" r="7" fill="${C.ink}"/><circle cx="84" cy="126" r="2" fill="#fff"/><circle cx="120" cy="126" r="2" fill="#fff"/>
 <path d="M72 142Q100 166 128 142Z" fill="#fff" ${st(4)}/><path d="M86 146v8M100 148v10M114 146v8" stroke="${C.ink}" stroke-width="3"/>
 <text x="100" y="204" text-anchor="middle" ${FONT} font-size="22" fill="${C.yellow}" letter-spacing="2">RESTART</text>`;
}

export function bubble(x,y,w,h,text,{tail='down-left',size=22,fill='#fff',color=C.ink,lines}={}){
 const tl={
  'down-left':`M${x+28} ${y+h-2}l-10 24 30-22`,
  'down-right':`M${x+w-48} ${y+h-2}l30 22-10-24`,
  'left':`M${x+2} ${y+h/2-10}l-22 18 22 2`,
  'right':`M${x+w-2} ${y+h/2-10}l22 18-22 2`,
  'up-left':`M${x+26} ${y+2}l-6-22 30 22`
 }[tail]||'';
 const ls=lines||[text];
 const lh=size*1.12,start=y+h/2-(ls.length-1)*lh/2+size*.36;
 return `<path d="${tl}" fill="${fill}" ${st(4)}/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="${fill}" ${st(4)}/><path d="${tl}" fill="${fill}" stroke="none" transform="translate(0 -3)"/>${ls.map((l,i)=>`<text x="${x+w/2}" y="${start+i*lh}" text-anchor="middle" ${FONT} font-size="${size}" fill="${color}">${l}</text>`).join('')}`;
}
export function laptop(x,y,s,screen){return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="0" y="0" width="160" height="104" rx="10" fill="${C.dark}" ${st()}/><rect x="10" y="10" width="140" height="84" rx="5" fill="#fff" ${st(3)}/>${screen}<path d="M-16 104h192l-12 16H-4Z" fill="#8b8580" ${st()}/></g>`}
const bar=(x,y,w,pct,color)=>`<rect x="${x}" y="${y}" width="${w}" height="14" rx="7" fill="#eee5d6" ${st(3)}/><rect x="${x}" y="${y}" width="${Math.max(14,w*pct)}" height="14" rx="7" fill="${color}" ${st(3)}/>`;
const screenTxt=(t,y,size,color=C.ink)=>`<text x="80" y="${y}" text-anchor="middle" ${FONT} font-size="${size}" fill="${color}">${t}</text>`;
export function burst(cx,cy,r,fill,n=14,inner=.78){let d='';for(let i=0;i<n*2;i++){const a=Math.PI*i/n-Math.PI/2,rr=i%2?r*inner:r;d+=(i?'L':'M')+(cx+Math.cos(a)*rr).toFixed(1)+' '+(cy+Math.sin(a)*rr).toFixed(1)}return `<path d="${d}Z" fill="${fill}" ${st()}/>`}
export const sparkle=(x,y,s=1,fill=C.yellow)=>`<path transform="translate(${x} ${y}) scale(${s})" d="M0-16Q2-2 16 0Q2 2 0 16Q-2 2-16 0Q-2-2 0-16Z" fill="${fill}" ${st(3)}/>`;
const dizzy=(x,y)=>`${sparkle(x-26,y,.7)}${sparkle(x+4,y-14,.55,'#fff')}${sparkle(x+30,y+2,.7)}<path d="M${x-34} ${y+10}q34 18 68 0" fill="none" stroke="${C.ink}" stroke-width="3" stroke-dasharray="4 7" stroke-linecap="round"/>`;
const place=(x,y,s,inner,rot=0)=>`<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">${inner}</g>`;
const floor=(w,y)=>`<path d="M0 ${y}H${w}" stroke="${C.ink}" stroke-width="4"/>`;
const desk=(x,y,w,f=282)=>`<path d="M${x+14} ${y+16}V${f}M${x+w-14} ${y+16}V${f}" stroke="${C.ink}" stroke-width="6"/><rect x="${x}" y="${y}" width="${w}" height="16" rx="4" fill="${C.wood}" ${st()}/>`;

// ===== Scenes =====
export function heroScene(){
 const body=`${burst(390,250,240,C.yellow,16,.84)}
 ${sparkle(120,110,1.1,'#fff')}${sparkle(560,70,.9)}${sparkle(610,330,.8,'#fff')}
 <g><rect x="22" y="150" width="236" height="96" rx="12" fill="#fff" ${st()}/><path d="M22 186V162a12 12 0 0 1 12-12h212a12 12 0 0 1 12 12v24Z" fill="${C.red}" ${st()}/><text x="40" y="176" ${FONT} font-size="17" fill="#fff">gary.exe</text><path d="M232 160l10 10m0-10-10 10" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/><text x="140" y="214" text-anchor="middle" ${FONT} font-size="19" fill="${C.ink}">has stopped working :(</text><text x="140" y="236" text-anchor="middle" font-family="DM Sans,system-ui,sans-serif" font-size="12" fill="#6b645c">at row 71 of 100. no checkpoint, no note.</text></g>
 <clipPath id="rw-desk-clip"><rect x="0" y="0" width="640" height="500"/></clipPath>
 ${desk(34,346,250,500)}
 ${laptop(80,252,.95,`${screenTxt('70 / 100',48,26)}${bar(24,60,112,.7,C.orange)}`)}
 ${place(48,528,.72,garyBot({face:'dead',arms:'up'}),-90)}
 ${dizzy(102,404)}
 ${place(338,166,1.42,patchBot({face:'wink'}))}
 ${bubble(352,48,262,82,'',{tail:'down-left',size:27,lines:['relax. I got','the last 30.']})}
 ${floor(640,500)}`;
 return svg(640,540,body,'Gary the AI agent has fainted under his desk at 70 of 100 rows while Patch the repair robot walks in holding duct tape','rw-hero-art');
}
const panelBg=(w,h,fill)=>`<rect x="0" y="0" width="${w}" height="${h}" fill="${fill}"/>`;
const dots=(w,h)=>`<pattern id="rw-dots" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.8" fill="rgba(29,26,22,.12)"/></pattern><rect x="0" y="0" width="${w}" height="${h}" fill="url(#rw-dots)"/>`;
export function panel(n){
 const W=400,H=300;let b='';
 if(n===1)b=`${panelBg(W,H,'#cfe6ff')}${dots(W,H)}${desk(150,214,240)}${laptop(214,118,.92,`${screenTxt('41 / 100',48,24)}${bar(24,60,112,.41,C.blue)}`)}${place(40,52,.96,garyBot({face:'grin',arms:'type',item:'coffee'}))}${bubble(178,20,196,62,'',{tail:'down-left',size:22,lines:['this job is','SO easy']})}${floor(W,282)}`;
 if(n===2)b=`${panelBg(W,H,'#ffd0d6')}${dots(W,H)}${burst(270,118,128,'#fff',14,.74)}${laptop(194,62,.95,`${screenTxt('ROW 71',40,22,C.red)}${screenTxt('country: "??"',66,16)}`)}${desk(150,175,240)}${place(28,292,.7,garyBot({face:'dead',arms:'up'}),-90)}${dizzy(84,170)}${bubble(26,24,150,56,'',{tail:'down-left',size:24,lines:['brb']})}${floor(W,282)}`;
 if(n===3)b=`${panelBg(W,H,'#3b3350')}<g opacity=".25">${burst(200,150,190,'#6d5c96',18,.6)}</g>${place(108,48,1.02,restartVillain())}${bubble(18,22,170,74,'',{tail:'down-right',size:20,lines:["let's just","start over :)"]})}<g transform="rotate(8 330 70)"><rect x="262" y="40" width="128" height="62" rx="8" fill="${C.yellow}" ${st()}/><text x="326" y="66" text-anchor="middle" ${FONT} font-size="15" fill="${C.ink}">DELETES ALL</text><text x="326" y="88" text-anchor="middle" ${FONT} font-size="15" fill="${C.ink}">70 GOOD ROWS</text></g>`;
 if(n===4)b=`${panelBg(W,H,'#c9f2dc')}${dots(W,H)}${sparkle(370,40,.9)}${sparkle(30,190,.7,'#fff')}${desk(196,206,200)}${laptop(236,112,.86,`${screenTxt('100 / 100',44,22,C.green)}${bar(24,58,112,1,C.green)}`)}<g transform="rotate(-4 300 250)"><path d="M262 222h66v62l-8-6-8 6-8-6-8 6-8-6-8 6-8-6-10 6Z" fill="#fff" ${st(3)}/><text x="295" y="242" text-anchor="middle" ${FONT} font-size="12" fill="${C.ink}">RECEIPT</text><path d="M272 252h46M272 262h34" stroke="${C.ink}" stroke-width="2.5"/></g>${place(18,50,.98,patchBot({face:'wink',arms:'wave',item:''}))}${bubble(196,16,190,62,'',{tail:'down-left',size:20,lines:['done. kept','your 70 rows.']})}${floor(W,282)}`;
 return svg(W,H,b,['','Gary happily typing at 41 of 100','Gary fainted at row 71 and said brb','The Restart Button grinning, ready to delete 70 good rows','Patch finished the job at 100 of 100 and printed a receipt'][n],'rw-panel-art');
}
export function portrait(who){
 const map={
  patch:[C.orange,'#ffe1d4',patchBot({arms:'wave',item:'',face:'happy'}),'Patch, the duct-taped repair bot'],
  gary:['#8b97a8','#e4e9f1',garyBot({face:'panic',arms:'up',acc:['tie','sweat']}),'Gary, the agent who quits at 70 percent'],
  atlas:[C.green,'#dff3e4',atlasBot(),'Atlas, the bot who reads everything'],
  mender:[C.blue,'#dce7ff',menderBot(),'Mender, the bot who checks everything'],
  restart:[C.red,'#ffd9d4',restartVillain(),'The Restart Button, our villain']
 }[who]||[];
 return svg(220,250,`<circle cx="110" cy="130" r="104" fill="${map[1]}" ${st(4)}/>${place(10,10,1,map[2])}`,map[3],'rw-portrait');
}
export function mood(kind){
 if(kind==='sleep')return svg(220,230,`${place(10,0,1,patchBot({face:'sleep',arms:'down',item:''}))}<text x="168" y="40" ${FONT} font-size="26" fill="${C.ink}">z</text><text x="186" y="22" ${FONT} font-size="18" fill="${C.ink}">z</text>`,'Patch napping, nothing to fix');
 if(kind==='party')return svg(220,240,`${sparkle(24,40,.8)}${sparkle(196,60,.7,'#fff')}${sparkle(190,150,.6)}${place(10,4,1,patchBot({face:'grin',arms:'up',item:''}))}`,'Patch celebrating a finished job');
 if(kind==='gary')return svg(240,170,`${place(20,166,.66,garyBot({face:'dead',arms:'up',shadow:false}),-90)}${dizzy(72,96)}`,'Gary fainted again');
 return svg(220,240,place(10,4,1,patchBot({face:'happy'})),'Patch ready to work');
}
// Head-only crop for small avatars.
export function head(who){const b={patch:patchBot({face:'happy',item:'',arms:'down'}),atlas:atlasBot({item:'',arms:'down'}),mender:menderBot({item:'',arms:'down'}),gary:garyBot({face:'happy'})}[who]||patchBot();return `<svg class="rw-art rw-head" viewBox="22 -2 156 132" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g>${b}</g></svg>`}
