// Edit this file on launch day. Everything on the site reads from here.
export const site={
 name:'RelayWorks',
 domain:'relayworks.fun',
 url:'https://relayworks.fun',
 x:'https://x.com/RelayWorksHQ',
 xHandle:'@RelayWorksHQ',
 github:'https://github.com/relayworkslab',
 githubHandle:'relayworkslab',
 email:'support@relayworks.fun',
 apiBase:'http://127.0.0.1:8787',
 cluster:'devnet',
 telegram:'', // optional: 'https://t.me/...'
 token:{
  ticker:'$RELAY',
  chain:'Solana',
  launchpad:'pump.fun',
  contract:'', // paste the mint address here at launch, e.g. 'AbC...pump'
  pumpUrl:'', // e.g. 'https://pump.fun/coin/<mint>'
  dexUrl:'' // e.g. 'https://dexscreener.com/solana/<pair>'
 }
};
export const tokenLive=()=>Boolean(site.token.contract);
export const shortCa=()=>{const c=site.token.contract;return c.length>14?c.slice(0,6)+'…'+c.slice(-6):c};
