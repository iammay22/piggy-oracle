import re, os, shutil, subprocess, sys
os.chdir('/home/claude/digua-site')
DOM = sys.argv[1] if len(sys.argv) > 1 else 'https://super-swan-5b5b97.netlify.app'
GC = sys.argv[2] if len(sys.argv) > 2 else ''
SCR = '/tmp/claude-0/-home-claude/13a1fd83-a6db-5519-8bec-fd3a47b498c1/scratchpad/'
FS = SCR + 'fontsrc/g/otf/TW/'

def sub1(s, old, new):
    assert s.count(old) >= 1, old[:60]
    return s.replace(old, new, 1)

# ---------------- shared tokens (light + dark) ----------------
LIGHT = '--dg-bg:#f8f1f0;--dg-surface:#ffffff;--dg-surface-2:#f1e7e5;--dg-hover:#eadcd9;--dg-ink:#2a2022;--dg-soft:#6f6265;--dg-line:#ead9d6;--dg-line-a:rgba(42,32,34,.12);--dg-acc:#b84d6c;--dg-acc-dim:#dc9aad;--dg-acc-soft:rgba(184,77,108,.1);--dg-on-acc:#ffffff;--dg-potato:#b8652f;--dg-glass:rgba(255,255,255,.65);--dg-shadow:rgba(34,31,27,.14);--dg-place:#a39b8f;--dg-scrim:rgba(34,31,27,.45);color-scheme:light'
DARK = '--dg-bg:#1b1a18;--dg-surface:#252320;--dg-surface-2:#2e2b27;--dg-hover:#37332e;--dg-ink:#ece7de;--dg-soft:#a8a197;--dg-line:#3a3631;--dg-line-a:rgba(236,231,222,.12);--dg-acc:#f08fab;--dg-acc-dim:#8a4a5c;--dg-acc-soft:rgba(240,143,171,.16);--dg-on-acc:#2a1219;--dg-potato:#e0904f;--dg-glass:#252320;--dg-shadow:rgba(0,0,0,.4);--dg-place:#7d766c;--dg-scrim:rgba(0,0,0,.6);color-scheme:dark'
TOKENS = f''':root{{{LIGHT};--round:"GenSenRounded","PingFang TC","Microsoft JhengHei",sans-serif}}
@media (prefers-color-scheme:dark){{:root:not([data-theme="light"]){{{DARK}}}}}
:root[data-theme="dark"]{{{DARK}}}
'''
FONTS = '''@font-face{font-family:"GenSenRounded";font-weight:400;font-style:normal;font-display:swap;src:url(fonts/gensen-r.woff2) format("woff2")}
@font-face{font-family:"GenSenRounded";font-weight:700;font-style:normal;font-display:swap;src:url(fonts/gensen-b.woff2) format("woff2")}
'''

NAVCSS = '''<style>
''' + TOKENS + '''
.dg-nav{position:relative;z-index:6;display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;
  max-width:760px;margin:0 auto;padding-block:14px 4px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));
  font-family:var(--round);font-size:14px;line-height:1.4}
.dg-nav a{text-decoration:none;color:var(--dg-soft);font-weight:700}
.dg-nav a:hover{color:var(--dg-acc)}
.dg-nav a:focus-visible,.dg-shared a:focus-visible{outline:2px solid var(--dg-acc);outline-offset:2px;border-radius:6px}
.dg-nav .home{display:inline-flex;align-items:center;gap:6px}
.dg-nav .home img{width:30px;height:auto}
.dg-nav .seg{display:flex;gap:2px;background:var(--dg-surface-2);border:1px solid var(--dg-line-a);border-radius:999px;padding:3px}
.dg-nav .seg a{padding:4px 12px;border-radius:999px;font-weight:500}
.dg-nav .seg a[aria-current]{background:var(--dg-surface);color:var(--dg-ink);font-weight:700;box-shadow:0 1px 3px var(--dg-shadow)}
.dg-nav.inset{margin-left:calc(-1*max(16px,env(safe-area-inset-left,0px)));margin-right:calc(-1*max(16px,env(safe-area-inset-right,0px)))}
.dg-shared{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin:0 0 16px;padding:12px 16px;border-radius:16px;
  background:var(--dg-acc-soft);color:var(--dg-ink);font-family:var(--round);font-size:15px}
.dg-shared a{color:var(--dg-acc);font-weight:700;text-decoration:none;white-space:nowrap}
.dg-toast{position:fixed;left:50%;bottom:calc(24px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:40;background:var(--dg-ink);color:var(--dg-bg);
  padding:8px 18px;border-radius:999px;font-family:var(--round);font-size:14px;white-space:nowrap}
.dg-foot{max-width:760px;margin:36px auto 0;padding-block:20px 32px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));
  border-top:1px solid var(--dg-line);display:block;text-align:center;font-family:var(--round);font-size:14px;line-height:1.8;color:var(--dg-soft)}
.dg-foot p{margin:0}
.dg-foot nav{display:flex;justify-content:center;gap:16px;flex-wrap:wrap;margin:6px 0}
.dg-foot a{color:var(--dg-ink);text-decoration:none;font-weight:700}
.dg-foot a:hover{color:var(--dg-acc)}
.dg-foot .by{font-size:12.5px;letter-spacing:.08em}
.dg-h{font-family:var(--round);font-size:17px;font-weight:700;margin:22px 0 8px;color:var(--dg-ink)}
.dg-sub{font-size:13px;color:var(--dg-soft);margin:-4px 0 8px}
.dg-acts{margin:0 0 12px;padding-left:1.3em;display:grid;gap:6px}
.dg-extra{display:flex;flex-direction:column;gap:10px}.dg-extra .dg-h{margin:10px 0 0}.dg-extra p,.dg-extra ul{margin:0}
.dg-topics{display:flex;flex-wrap:wrap;gap:6px;align-items:center;font-family:var(--round);font-size:14px;color:var(--dg-soft)}
.dg-topics button{font:inherit;border:1px solid var(--dg-line);background:var(--dg-surface);color:var(--dg-ink);border-radius:999px;padding:4px 14px;cursor:pointer}
.dg-topics button[aria-pressed="true"]{background:var(--dg-acc);color:var(--dg-on-acc);border-color:var(--dg-acc);font-weight:700}
.dg-topics button:focus-visible{outline:2px solid var(--dg-acc);outline-offset:2px}
.dg-greet{display:flex;align-items:center;gap:10px;max-width:760px;margin:6px auto 0;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));font-family:var(--round)}
.dg-greet img{width:84px;height:auto;flex:none}
.dg-greet p{position:relative;margin:0;background:var(--dg-surface);color:var(--dg-ink);border:1px solid var(--dg-line);border-radius:16px;padding:8px 14px;font-size:15px;line-height:1.6;min-width:0}
.dg-greet p::before{content:"";position:absolute;left:-7px;top:50%;width:12px;height:12px;background:var(--dg-surface);border-left:1px solid var(--dg-line);border-bottom:1px solid var(--dg-line);transform:translateY(-50%) rotate(45deg)}
.dg-greet.inset{margin-left:calc(-1*max(16px,env(safe-area-inset-left,0px)));margin-right:calc(-1*max(16px,env(safe-area-inset-right,0px)))}
.dg-learn{margin-top:14px}
.dg-card{background:var(--dg-surface);border:1px solid var(--dg-line);border-radius:20px;padding:16px 20px;margin-top:26px;font-family:var(--round)}
.dg-card summary{cursor:pointer;font-weight:700;color:var(--dg-acc);list-style:none}
.dg-card summary::-webkit-details-marker{display:none}
.dg-card summary::before{content:"＋ "}.dg-card[open] summary::before{content:"－ "}
.dg-card summary:focus-visible{outline:2px solid var(--dg-acc);outline-offset:3px;border-radius:6px}
.dg-learn summary{font-size:16px}
.dg-learn-b{display:flex;flex-direction:column;gap:12px;margin-top:12px;font-size:15px;line-height:1.85}
.dg-learn-b p{margin:0}
.dg-learn-b p>b:first-child{display:block;font-size:15.5px;color:var(--dg-acc);margin-bottom:2px}
.dg-learn-b b.in{color:var(--dg-ink)}
.dg-modal{position:fixed;inset:0;z-index:60;background:var(--dg-scrim);display:flex;align-items:center;justify-content:center;padding:max(16px,env(safe-area-inset-top,0px)) max(16px,env(safe-area-inset-right,0px)) max(16px,env(safe-area-inset-bottom,0px)) max(16px,env(safe-area-inset-left,0px))}
.dg-sheet{background:var(--dg-surface);color:var(--dg-ink);border-radius:24px;padding:16px;width:100%;max-width:420px;max-height:100%;overflow:auto;display:flex;flex-direction:column;gap:10px;align-items:center;font-family:var(--round);text-align:center}
.dg-sheet img{width:100%;height:auto;border-radius:14px;box-shadow:0 10px 30px -12px var(--dg-shadow)}
.dg-tip{font-size:13px;color:var(--dg-soft);margin:0}.dg-wait{padding:40px 10px;margin:0}
.dg-acts2{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}
.dg-b{font:inherit;font-weight:700;font-size:15px;border:0;border-radius:14px;padding:10px 18px;background:var(--dg-acc);color:var(--dg-on-acc);text-decoration:none;cursor:pointer}
.dg-b.ghost{background:none;color:var(--dg-ink);border:1.5px solid var(--dg-line)}
.dg-b:focus-visible{outline:2px solid var(--dg-acc);outline-offset:2px}
.dg-hrow{display:flex;align-items:center;justify-content:space-between;gap:10px 12px;flex-wrap:wrap;max-width:760px;margin:14px auto 4px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));font-family:var(--round)}
.dg-hrow.inset{margin-left:calc(-1*max(16px,env(safe-area-inset-left,0px)));margin-right:calc(-1*max(16px,env(safe-area-inset-right,0px)))}
.dg-brand{display:flex;align-items:center;gap:10px;margin:0;font-family:var(--round);font-weight:700;font-size:20px;letter-spacing:.06em;color:var(--dg-ink);line-height:1.3}
.dg-ic{width:38px;height:38px;border-radius:50%;display:grid;place-items:center;background:var(--dg-acc-soft);color:var(--dg-acc);font-size:18px;letter-spacing:0;flex:none}
.dg-tabs{display:flex;gap:2px;background:var(--dg-surface-2);border:1px solid var(--dg-line-a);border-radius:999px;padding:3px}
.dg-tabs button{font:inherit;font-family:var(--round);font-size:14px;border:0;background:none;color:var(--dg-soft);padding:6px 12px;border-radius:999px;cursor:pointer}
.dg-tabs button[aria-selected="true"]{background:var(--dg-acc);color:var(--dg-on-acc);font-weight:700}
.dg-tabs button:focus-visible{outline:2px solid var(--dg-acc);outline-offset:2px}
.dg-hero{margin:6px 0 18px;font-family:var(--round)}
.dg-hero .dg-eb,.hero .eyebrow{font-size:13px;letter-spacing:.2em;color:var(--dg-acc-dim);font-weight:400}
.dg-hero h1,.hero h1{font-family:var(--round);font-size:clamp(28px,7vw,38px);font-weight:700;margin:4px 0 6px;color:var(--dg-ink);line-height:1.3;text-wrap:balance}
.dg-hero p,.hero p{color:var(--dg-soft);margin:0;max-width:34em;line-height:1.75;font-size:16px}
.dg-hero ol{display:flex;flex-wrap:wrap;gap:6px 18px;margin:10px 0 0;padding:0;list-style:none;counter-reset:s;font-size:14px;color:var(--dg-soft)}
.dg-hero ol li{counter-increment:s;display:flex;gap:6px}.dg-hero ol li::before{content:counter(s);font-weight:700;color:var(--dg-acc)}
.dg-filters{display:flex;gap:6px;flex-wrap:wrap;margin:14px 0 16px}
.dg-chip{font:inherit;font-family:var(--round);font-size:15px;border:1px solid var(--dg-line);background:var(--dg-surface);color:var(--dg-ink);border-radius:999px;padding:7px 16px;cursor:pointer}
.dg-chip[aria-pressed="true"]{border-color:var(--dg-acc);background:var(--dg-acc-soft);color:var(--dg-acc);font-weight:700}
.dg-libgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(82px,1fr));gap:14px 12px}
.dg-libc{border:0;background:none;padding:0;text-align:center;font-family:var(--round);font-size:12.5px;line-height:1.4;color:var(--dg-soft);cursor:pointer;min-width:0}
.dg-libc b{display:block;color:var(--dg-ink);font-size:14px;margin-top:4px}
.dg-libc .dg-face{width:100%;filter:drop-shadow(0 3px 5px var(--dg-shadow))}
.dg-libc .dg-face.leno{aspect-ratio:100/148}.dg-libc .dg-face svg{display:block;width:100%;height:100%}
.dg-libc .dg-face.hexbox{aspect-ratio:7/12;background:var(--dg-surface);border:1px solid var(--dg-line);border-radius:8px;display:grid;place-items:center}
.dg-libc .dg-face.slipt{aspect-ratio:7/12;background:#f4e3c1;border-radius:6px;box-shadow:inset 0 0 0 3px #f4e3c1,inset 0 0 0 4px #a8322a;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;color:#3b1613}
.slipt em{font-style:normal;font-size:12px}.slipt strong{font-size:18px;writing-mode:vertical-rl;letter-spacing:.15em}
.slipt .tone,.dg-bsheet .tone{font-size:11px;font-weight:700;border-radius:999px;padding:1px 8px;color:#fff}
.tone.t0{background:#a8322a}.tone.t1{background:#a77a2a}.tone.t2{background:#5d6470}
.hexf{display:flex;flex-direction:column-reverse;gap:5px;width:62%}.hexf i{display:flex;gap:6px;height:6px}.hexf b{flex:1;background:var(--dg-ink);border-radius:1px}
.hexf.big{width:150px;gap:9px}.hexf.big i{height:14px;gap:16px}
.dg-scrim{position:fixed;inset:0;z-index:55;background:var(--dg-scrim);display:flex;align-items:flex-end;justify-content:center}
.dg-bsheet{background:var(--dg-surface);color:var(--dg-ink);width:100%;max-width:640px;max-height:88%;overflow:auto;border-radius:20px 20px 0 0;border:1px solid var(--dg-line);font-family:var(--round);line-height:1.7;
  padding-block:18px calc(24px + env(safe-area-inset-bottom,0px));padding-left:max(18px,env(safe-area-inset-left,0px));padding-right:max(18px,env(safe-area-inset-right,0px));animation:dgup .3s ease}
@keyframes dgup{from{transform:translateY(40px);opacity:0}}
.dg-bsheet .slip{clear:both}
.dg-sx{float:right;width:34px;height:34px;border-radius:50%;border:1px solid var(--dg-line);background:none;color:var(--dg-ink);font:inherit;cursor:pointer}
.dg-big{width:150px;margin:8px auto 12px;filter:drop-shadow(0 6px 12px var(--dg-shadow))}.dg-big.leno{aspect-ratio:100/148}.dg-big svg{display:block;width:100%;height:100%}
.dg-big.hexbig{display:flex;justify-content:center;filter:none}
.dg-bsheet h3{text-align:center;font-size:24px;margin:0;font-weight:700}
.dg-en{text-align:center;color:var(--dg-soft);font-size:13px;letter-spacing:.04em}
.dg-kws{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin:10px 0 4px}.dg-kws span{font-size:13px;background:var(--dg-acc-soft);color:var(--dg-acc);padding:2px 10px;border-radius:6px}
.dg-classic{font-size:17px;font-weight:700;text-align:center;margin:10px 0 2px}.dg-sub2{text-align:center;color:var(--dg-soft);margin:0}
.dg-two{display:grid;grid-template-columns:1fr;gap:12px;margin-top:14px}@media(min-width:520px){.dg-two{grid-template-columns:1fr 1fr}}
.dg-two>div{background:var(--dg-bg);border:1px solid var(--dg-line);border-radius:12px;padding:12px}.dg-two h4{margin:0 0 4px;font-size:15px;color:var(--dg-acc)}.dg-two p{margin:0;font-size:15px}
.dg-hist{display:grid;gap:10px}
.dg-hi{display:flex;justify-content:space-between;align-items:center;gap:10px;width:100%;text-align:left;background:var(--dg-surface);border:1px solid var(--dg-line);border-radius:14px;padding:14px 16px;font-family:var(--round);color:var(--dg-ink);cursor:pointer}
.dg-ht{min-width:0}.dg-ht b{display:block;font-size:16px}.dg-ht span{display:block;font-size:13px;color:var(--dg-soft);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dg-go{font-size:22px;color:var(--dg-soft)}
.dg-empty{text-align:center;color:var(--dg-soft);padding:40px 10px;font-family:var(--round);line-height:1.8}
.dg-center{display:flex;justify-content:center;margin-top:14px}
.dg-link{font:inherit;font-family:var(--round);font-size:14px;background:none;border:0;color:var(--dg-soft);text-decoration:underline;text-underline-offset:3px;cursor:pointer}
.dg-copy{width:100%;margin-top:10px;font:inherit;font-size:14px;padding:10px;border-radius:12px;border:1px solid var(--dg-line);background:var(--dg-surface-2);color:var(--dg-ink)}
</style>'''

OVR = {
'tarot': '''<style>
:root:root:root{--velvet:var(--dg-bg);--velvet-2:var(--dg-surface);--sky:var(--dg-surface-2);--brass:var(--dg-acc);--brass-dim:var(--dg-acc-dim);--on-accent:var(--dg-on-acc);--tint:var(--dg-acc-soft);
  --paper:#ffffff;--ink:var(--dg-ink);--text:var(--dg-ink);--muted:var(--dg-soft);--line:var(--dg-line);--shadow:var(--dg-shadow);--f-display:var(--round);--f-body:var(--round)}
body{background:var(--dg-bg)!important;-webkit-font-smoothing:antialiased}
.top{position:static;background:transparent;border-bottom:0;backdrop-filter:none}
.top .brand{color:var(--dg-ink);font-weight:700}
.btn{background:var(--dg-ink);color:var(--dg-bg);border-radius:16px;font-weight:700}
.btn.ghost{background:none;color:var(--dg-ink);border:1.5px solid var(--dg-line-a)}
.sp,.opts,.focuspanel,.hi,.stat,.chip,textarea,input[type=text]{border-radius:16px}
.focuspanel,.sheet{box-shadow:0 30px 70px -36px var(--dg-shadow)}
.table{background:var(--dg-surface-2)}
textarea::placeholder,input::placeholder{color:var(--dg-place)}
.sw::after{background:var(--dg-surface)}
.slot.focus .cf{box-shadow:0 0 0 2px var(--dg-acc),0 0 18px var(--dg-acc-soft)}
.scrim{background:var(--dg-scrim)}
.toast{background:var(--dg-ink);color:var(--dg-bg)}
h1,h2,h3{font-weight:700}
.hero h1{font-weight:700}
</style>''',
'iching': '''<style>
:root:root:root{--bg:var(--dg-bg);--card:var(--dg-surface);--sunk:var(--dg-surface-2);--ink:var(--dg-ink);--muted:var(--dg-soft);--line:var(--dg-line);--jade:var(--dg-acc);--jade-soft:var(--dg-acc-soft);--on-jade:var(--dg-on-acc);
  --qing:var(--dg-acc);--shadow:var(--dg-shadow);--f-display:var(--round);--f-body:var(--round)}
body{background:var(--dg-bg)!important;-webkit-font-smoothing:antialiased}
.panel{border-radius:28px;background:var(--dg-glass);box-shadow:0 30px 70px -36px var(--dg-shadow)}
.btn{border-radius:16px;letter-spacing:.04em}
.btn.ghost{background:none;color:var(--dg-ink);border:1.5px solid var(--dg-line-a)}
.seg{border-radius:14px}.seg button{border-radius:11px}
textarea,input[type=text],input[type=number]{border-radius:14px;background:var(--dg-surface-2)}
input::placeholder,textarea::placeholder{color:var(--dg-place)}
.hi,.key{border-radius:16px}
.rows .row.empty{padding:0}
h1,h2,h3{font-weight:700}
</style>''',
'lenormand': '''<style>
:root:root:root{--paper:var(--dg-bg);--card:var(--dg-surface);--ink:var(--dg-ink);--muted:var(--dg-soft);--accent:var(--dg-acc);--line:var(--dg-line);--back:#9e4a60;--on-accent:var(--dg-on-acc);--display:var(--round);--body:var(--round)}
body{-webkit-font-smoothing:antialiased}
.reading{border-radius:24px;box-shadow:0 30px 70px -36px var(--dg-shadow)}
.btn,.seg,.q{border-radius:14px}
.acts{display:flex;gap:10px;flex-wrap:wrap}
</style>''',
}

# ---------------- page JS additions ----------------
COMMON_JS = r'''
/* ---- 問問小豬: share links + stats ---- */
const dgT=p=>{try{window.dgTrack&&window.dgTrack(p)}catch(e){}};
function dgToast(m){let t=document.querySelector('.dg-toast');if(!t){t=document.createElement('div');t.className='dg-toast';document.body.appendChild(t)}t.textContent=m;t.hidden=false;clearTimeout(t._t);t._t=setTimeout(()=>t.hidden=true,2000)}
function dgBase(){return location.href.split('#')[0].split('?')[0]}
function dgShare(url,title,anchor){
  dgT(location.pathname.replace(/^.*\//,'').replace('.html','')+'/share');
  if(navigator.share){navigator.share({title:title,text:title,url:url}).catch(()=>{});return}
  const fb=()=>{if(!anchor)return;let b=anchor.parentElement.querySelector('.dg-copy');if(!b){b=document.createElement('textarea');b.className='dg-copy';b.readOnly=true;b.rows=3;anchor.parentElement.after(b)}b.value=url;b.focus();b.select();dgToast('長按連結複製')};
  try{navigator.clipboard.writeText(url).then(()=>dgToast('已複製連結，貼給朋友吧'),fb)}catch(e){fb()}
}
function dgSharedBanner(el,again){el.insertAdjacentHTML('afterbegin',`<div class="dg-shared"><span>這是朋友分享給你的結果</span><a href="${again}">換我抽一次 →</a></div>`)}
'''

TAROT_JS = r'''
function shareURL(r){const u=new URLSearchParams();u.set('s',r.spread);u.set('t',r.topic);u.set('c',r.cards.map(c=>c.id+(c.rev?'r':'')).join('.'));if(r.q)u.set('q',r.q);if(r.A)u.set('a',r.A);if(r.B)u.set('b',r.B);return dgBase()+'?'+u.toString()}
document.addEventListener('click',e=>{const el=e.target.closest('[data-act="share"]');if(!el||!S.reading)return;dgShare(shareURL(S.reading),'我抽到的塔羅牌｜問問小豬',el)});
const _startReading=startReading;startReading=function(){_startReading();const r=S.reading;dgT('tarot/done/'+r.spread);dgT('tarot/topic/'+r.topic);r.cards.forEach(c=>dgT('tarot/card/'+BYID[c.id].name+(c.rev?'-逆位':'')))};
const _renderReading=renderReading;renderReading=function(){_renderReading();if(S.reading&&S.reading.shared)dgSharedBanner(V,dgBase())};
(function(){
  const P=new URLSearchParams(location.search),c=P.get('c'),sp=P.get('s');
  if(c&&SP[sp]){const cards=c.split('.').map(x=>({id:x.replace(/r$/,''),rev:/r$/.test(x)}));
    if(cards.length===SP[sp].pos.length&&cards.every(x=>BYID[x.id])){
      S.reading={t:Date.now(),q:P.get('q')||'',topic:TOPICS[P.get('t')]?P.get('t'):'general',spread:sp,A:P.get('a')||'',B:P.get('b')||'',cards,flipped:cards.map((_,i)=>i),_done:true,shared:true};
      S.focus=0;dgT('tarot/opened-share');go('reading');return}}
  renderSetup();
})();
'''

ICHING_JS = r'''
function shareURL(r){const u=new URLSearchParams();u.set('v',r.vals.join(''));u.set('m',r.method);if(r.detail)u.set('d',r.detail);if(r.q)u.set('q',r.q);return dgBase()+'?'+u.toString()}
document.addEventListener('click',e=>{const el=e.target.closest('[data-act="share"]');if(!el||!S.res)return;dgShare(shareURL(S.res),'我起到的卦｜問問小豬',el)});
const _cast=cast;cast=function(vals,m,d){_cast(vals,m,d);const b=hexOf(vals);dgT('iching/done/'+m);dgT('iching/hex/'+b.full)};
const _renderResult=renderResult;renderResult=function(){_renderResult();if(S.res&&S.res.shared)dgSharedBanner(V,dgBase())};
(function(){
  const P=new URLSearchParams(location.search),v=P.get('v');
  if(v&&/^[6-9]{6}$/.test(v)){const m=P.get('m');S.res={t:Date.now(),q:P.get('q')||'',method:MNAME[m]?m:'coin',detail:P.get('d')||'',vals:v.split('').map(Number),shared:true};dgT('iching/opened-share')}
  render();
})();
'''

LENO_JS = r'''
let dgShared=false;
function shareURL(){const u=new URLSearchParams();u.set('l',picked.map(c=>c.n).join('.'));const q=$("question").value.trim();if(q)u.set('q',q);if(dgTopic!=='general')u.set('t',dgTopic);return dgBase()+'?'+u.toString()}
document.addEventListener('click',e=>{const el=e.target.closest('#shareBtn');if(!el)return;dgShare(shareURL(),'我抽到的雷諾曼｜問問小豬',el)});
const _showReading=showReading;showReading=function(){_showReading();if(picked.length<mode)return;
  if(dgShared){dgShared=false;dgSharedBanner($("reading"),dgBase())}else if(!dgOpening){lenoSave();dgT('lenormand/done/'+mode);dgT('lenormand/asked/'+dgTopic);picked.forEach(c=>dgT('lenormand/card/'+c.name))}};
(function(){
  const P=new URLSearchParams(location.search),l=P.get('l');
  if(l){const ns=l.split('.').map(Number);
    if((ns.length===1||ns.length===3)&&ns.every(n=>n>=1&&n<=36)&&new Set(ns).size===ns.length){
      mode=ns.length;$("m1").setAttribute("aria-pressed",mode===1);$("m3").setAttribute("aria-pressed",mode===3);newRound();
      picked=ns.map(n=>D[n-1]);dgSetTopic(P.get('t'));$("question").value=P.get('q')||'';drawSlots();picked.forEach((_,i)=>$("cx"+i).classList.add("on"));updateStatus();
      dgShared=true;dgT('lenormand/opened-share');showReading();return}}
  newRound();
})();
'''

STATS_JS = '''/* 問問小豬 — anonymous counts sent to your Google Sheet. Leave SHEET_URL empty to turn counting off. */
(function(){
  var SHEET_URL = '%s';
  var q = [], t;
  function page(){ return (location.pathname.split('/').pop() || 'index').replace('.html','') || 'index'; }
  function flush(){
    if(!q.length) return;
    var body = JSON.stringify(q); q = [];
    try{ fetch(SHEET_URL, {method:'POST', mode:'no-cors', keepalive:true, headers:{'Content-Type':'text/plain;charset=utf-8'}, body:body}).catch(function(){}); }catch(e){}
  }
  window.dgTrack = function(path){
    if(!SHEET_URL) return;
    var a = String(path).split('/');
    q.push({p:a[0], e:a[1]||'', d:a.slice(2).join('/')});
    clearTimeout(t); t = setTimeout(flush, 800);
  };
  if(!SHEET_URL) return;
  var from = '';
  if(location.search) from = 'share';
  else if(document.referrer){ try{ var h = new URL(document.referrer).hostname; from = h === location.hostname ? 'inside' : h; }catch(e){} }
  window.dgTrack(page() + '/view/' + from);
  addEventListener('pagehide', flush);
})();
''' % GC

FOOT = '<footer class="dg-foot"><p>結果參考就好，決定權在你手上。</p><nav aria-label="其他占卜"><a href="index.html">首頁</a><a href="tarot.html">塔羅</a><a href="iching.html">易經</a><a href="lenormand.html">雷諾曼</a><a href="qian.html">求籤</a></nav><p class="by">by may22</p></footer>'

def room(tok, extra=''):
    return '<style>\n/* room look */\n:root:root:root:root{' + tok + '}\n' + extra + '\n</style>'
ROOM = {
 'tarot': room('--dg-bg:#eee9f6;--dg-surface:#fbf9fd;--dg-surface-2:#e6dff1;--dg-hover:#ddd4ec;--dg-ink:#2b2540;--dg-soft:#6f6889;--dg-line:#ddd5ea;--dg-line-a:rgba(43,37,64,.12);--dg-acc:#6a55b0;--dg-acc-dim:#a99bd6;--dg-acc-soft:rgba(106,85,176,.12);--dg-on-acc:#ffffff;--dg-glass:#fbf9fd;--dg-shadow:rgba(60,40,110,.16);--dg-place:#a9a2bf;--dg-scrim:rgba(43,37,64,.45);color-scheme:light',
   'body{background-image:radial-gradient(rgba(106,85,176,.22) 1px,transparent 1.5px),radial-gradient(rgba(106,85,176,.12) 1px,transparent 1.5px)!important;background-size:53px 53px,31px 31px!important;background-position:0 0,17px 11px!important;background-attachment:fixed!important}\n.btn{background:var(--dg-acc);color:var(--dg-on-acc)}\n.btn.ghost{color:var(--dg-ink)}\n.top .brand svg{color:var(--dg-acc)}'),
 'iching': room('--dg-bg:#f2e8d5;--dg-surface:#fbf6ea;--dg-surface-2:#ebdfc6;--dg-hover:#e2d4b8;--dg-ink:#2b2420;--dg-soft:#7a6c5d;--dg-line:#ddcfb4;--dg-line-a:rgba(43,36,32,.14);--dg-acc:#a8322a;--dg-acc-dim:#c98a80;--dg-acc-soft:rgba(168,50,42,.08);--dg-on-acc:#fffaf0;--dg-glass:rgba(251,246,234,.85);--dg-shadow:rgba(80,50,20,.16);--dg-place:#b3a48e;--dg-scrim:rgba(43,36,32,.45);color-scheme:light',
   'body{background-image:radial-gradient(90% 50% at 50% 0%,#fbf5e8 0%,transparent 70%)!important}\n.panel{box-shadow:inset 0 0 0 5px var(--dg-surface),inset 0 0 0 6px var(--dg-line),0 30px 70px -36px var(--dg-shadow)}'),
 'lenormand': room('--dg-bg:#f3e9df;--dg-surface:#fcf7f1;--dg-surface-2:#ecdfd1;--dg-hover:#e4d4c3;--dg-ink:#3a2a2a;--dg-soft:#7a6863;--dg-line:#e2d3c2;--dg-line-a:rgba(58,42,42,.13);--dg-acc:#b5566e;--dg-acc-dim:#d79aa8;--dg-acc-soft:rgba(181,86,110,.1);--dg-on-acc:#fff8f2;--dg-glass:#fcf7f1;--dg-shadow:rgba(90,50,40,.16);--dg-place:#b0a197;--dg-scrim:rgba(58,42,42,.45);color-scheme:light',
   'body{background:var(--dg-bg)!important;background-image:repeating-linear-gradient(0deg,rgba(120,70,50,.025) 0 2px,transparent 2px 6px)!important}'),
 'qian': room('--dg-bg:#fbf0e3;--dg-surface:#fffaf3;--dg-surface-2:#f5e3ce;--dg-hover:#efd8bc;--dg-ink:#4a1c15;--dg-soft:#8a5a4a;--dg-line:#ecd2b6;--dg-line-a:rgba(74,28,21,.14);--dg-acc:#b3261e;--dg-acc-dim:#d98b80;--dg-acc-soft:rgba(179,38,30,.08);--dg-on-acc:#fff6e6;--dg-glass:#fffaf3;--dg-shadow:rgba(120,40,20,.18);--dg-place:#c4a28a;--dg-scrim:rgba(74,28,21,.45);color-scheme:light',
   'body{margin:0;background:var(--dg-bg);background-image:radial-gradient(70% 40% at 50% 0%,rgba(233,184,79,.22),transparent 70%),repeating-radial-gradient(circle at 50% -20%,rgba(179,38,30,.035) 0 2px,transparent 2px 28px);color:var(--dg-ink);-webkit-font-smoothing:antialiased}'),
}


ICHING_LEARN = """
  <details class="dg-learn dg-card" id="dg-learn">
    <summary>第一次玩？易經怎麼讀</summary>
    <div class="dg-learn-b">
      <p><b>卦是怎麼組成的</b>易經有 64 個卦，每個卦由六條線組成，叫做「爻」。一條完整的長線是<b class="in">陽爻</b>，中間斷開的是<b class="in">陰爻</b>。六條線<b class="in">由下往上</b>排，最下面是初爻，最上面是上爻。</p>
      <p><b>擲銅錢怎麼算</b>每次擲三枚銅錢，陽面算 3、陰面算 2，加起來會是 6、7、8 或 9：7 是陽爻，8 是陰爻；9 和 6 也是陽和陰，但它們是「會變的爻」，叫做動爻。擲六次，就排出一個完整的卦。</p>
      <p><b>本卦和變卦</b>先排出來的卦叫<b class="in">本卦</b>，代表你現在的狀況。如果有動爻，把它們陰陽對調，就會得到<b class="in">變卦</b>，代表事情接下來的發展。沒有動爻的話，就只看本卦。</p>
      <p><b>結果要先看哪裡</b>每個卦都有卦辭（整個卦的意思）和六句爻辭（每一條線的意思）。該讀哪一句，要看有幾個動爻；結果頁的「這次最該看的」已經依照傳統規則幫你挑好了，先讀那裡就好。</p>
      <p><b>一件事問一次就好</b>易經說「初筮告，再三瀆」：第一次問就會告訴你，同一件事反覆問，答案反而不準。不喜歡結果時，與其重擲，不如想想它在提醒你什麼。</p>
    </div>
  </details>"""


TAROT_LEARN = """
  <details class="dg-learn dg-card" id="dg-learn">
    <summary>第一次玩？塔羅怎麼讀</summary>
    <div class="dg-learn-b">
      <p><b>78 張牌分成兩大類</b><b class="in">大阿爾克那</b>有 22 張，像愚者、戀人、死神，講的是人生的大課題。<b class="in">小阿爾克那</b>有 56 張，講日常生活裡的事。抽到的大牌越多，代表這件事對你的影響越深。</p>
      <p><b>小牌的四種花色</b><b class="in">權杖</b>是行動和熱情，<b class="in">聖杯</b>是感情和人際，<b class="in">寶劍</b>是想法和溝通，<b class="in">錢幣</b>是金錢、工作和現實。每種花色有一到十的數字牌，加上侍者、騎士、皇后、國王四張宮廷牌，宮廷牌常常代表某個人，或你自己展現的個性。</p>
      <p><b>正位和逆位</b>牌倒過來出現叫逆位。逆位不等於壞事，比較像這股能量卡住了、延遲了，或是往內收。如果不想看逆位，開始前可以把「包含逆位牌」關掉。</p>
      <p><b>牌陣的位置很重要</b>牌陣裡的每個位置都有自己的意思，同一張牌放在「過去」和「未來」，讀法就不一樣。第一次玩建議用三張的「時間之流」，看過去、現在、未來。</p>
      <p><b>怎麼問比較準</b>開放式的問題，例如「我該怎麼面對這段關係？」，通常比「他會不會回來？」這種是非題更有收穫。一次問一件事，同一個問題也不要短時間內一直重抽。</p>
      <p><b>結果要怎麼看</b>先一張張看牌在各自位置的意思，再看下面的整體解讀和「牌和牌一起看」，最後照著「接下來可以這樣做」挑一件事去試試。</p>
    </div>
  </details>"""


TABDEF = {'tarot': ('塔', '夜燈塔羅', 'data-tab', [('draw', '抽牌'), ('lib', '牌義'), ('hist', '紀錄')]),
          'iching': ('易', '易卦小館', 'data-tab', [('cast', '起卦'), ('lib', '卦義'), ('hist', '紀錄')]),
          'lenormand': ('雷', '雷諾曼小抽屜', 'data-dgtab', [('draw', '抽牌'), ('lib', '牌義'), ('hist', '紀錄')]),
          'qian': ('籤', '擲筊求籤', 'data-dgtab', [('draw', '求籤'), ('lib', '籤詩'), ('hist', '紀錄')])}
def hrow(key, inset=False):
    ic, name, attr, tabs = TABDEF[key]
    bt = ''.join(f'<button type="button" role="tab" {attr}="{k}" aria-selected="{"true" if i == 0 else "false"}">{v}</button>' for i, (k, v) in enumerate(tabs))
    return f'<div class="dg-hrow{" inset" if inset else ""}"><h1 class="dg-brand"><span class="dg-ic" aria-hidden="true">{ic}</span>{name}</h1><nav class="dg-tabs" role="tablist" aria-label="{name}">{bt}</nav></div>'
LENO_LEARN = """
  <details class="dg-learn dg-card" id="dg-learn">
    <summary>第一次玩？雷諾曼怎麼讀</summary>
    <div class="dg-learn-b">
      <p><b>36 張生活小事</b>雷諾曼有 36 張牌，每張都是具體的東西，像信、狗、鑰匙、房子。牌沒有正逆位，意思直接，適合問「最近會發生什麼」。</p>
      <p><b>像造句一樣讀</b>一張牌當<b class="in">主角</b>，旁邊的牌負責<b class="in">形容</b>它。例如「心＋老鼠」是被消磨的感情，「老鼠＋心」則是為感情焦慮。</p>
      <p><b>三張牌陣</b>中間那張是<b class="in">核心</b>，左右兩張在形容它。單張牌比較像今天的小提醒，順便看看事情偏「是」還是偏「否」。</p>
      <p><b>男士和女士</b>這兩張通常代表你自己，或某位重要的人。抽到了，代表答案跟你自己的想法有關。</p>
      <p><b>選你想問的方面</b>抽牌前可以選感情、工作或財運，每張牌會改用那個方面的說法，抽完也能切換。</p>
    </div>
  </details>"""

def nav(cur, inset=False):
    L = [('tarot.html', '塔羅'), ('iching.html', '易經'), ('lenormand.html', '雷諾曼'), ('qian.html', '求籤')]
    links = ''.join(f'<a href="{h}"' + (' aria-current="page"' if h == cur else '') + f'>{t}</a>' for h, t in L)
    return f'<nav class="dg-nav{" inset" if inset else ""}" aria-label="問問小豬"><a class="home" href="index.html"><img src="img/pig-face.png" alt="" width="120" height="85">← 問問小豬</a><span class="seg">{links}</span></nav>'

PAGES = {
 'index.html': ('問問小豬｜塔羅・易經・雷諾曼', '有煩惱？問問小豬。免費線上塔羅、易經起卦、雷諾曼占卜，挑一種方式把問題交給牠。'),
 'tarot.html': ('塔羅牌｜問問小豬', '78 張萊德偉特塔羅，洗牌、切牌、親手抽牌，附正逆位與整體解讀。'),
 'iching.html': ('易經起卦｜問問小豬', '擲銅錢、姓名或數字起卦，看本卦變卦，直接告訴你這次最該讀哪一句。'),
 'lenormand.html': ('雷諾曼｜問問小豬', '36 張經典雷諾曼牌，三張連成一句話，適合問最近會發生什麼。'),
 'qian.html': ('擲筊求籤｜問問小豬', '線上擲筊抽六十甲子籤：擲到聖筊才能抽籤，附籤詩原文、白話解釋和感情、工作、財運的說法。'),
}
def meta(p):
    t, dsc = PAGES[p]; url = DOM + '/' + ('' if p == 'index.html' else p)
    return f'''<link rel="icon" href="img/favicon.png" type="image/png">
<link rel="apple-touch-icon" href="img/apple-touch-icon.png">
<link rel="manifest" href="manifest.webmanifest">
<meta name="theme-color" content="#f8f1f0">
<meta name="description" content="{dsc}">
<meta property="og:type" content="website">
<meta property="og:locale" content="zh_TW">
<meta property="og:site_name" content="問問小豬">
<meta property="og:title" content="{t}">
<meta property="og:description" content="{dsc}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{DOM}/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="{DOM}/og-image.jpg">
<link rel="stylesheet" href="theme.css">
<script src="stats.js"></script>
'''

out = {}
for key, src, dst, inset in [('tarot', 'src-tarot.html', 'tarot.html', False), ('iching', 'src-iching.html', 'iching.html', False), ('lenormand', 'src-leno.html', 'lenormand.html', True)]:
    s = open(src, encoding='utf8').read()
    s = re.sub(r'<title>[^<]*</title>', f'<title>{PAGES[dst][0]}</title>', s, count=1)
    i = s.index('</title>') + len('</title>')
    s = s[:i] + '\n' + meta(dst) + s[i:]
    j = s.index('</style>', s.index('<body>')) + len('</style>')
    s = s[:j] + '\n' + NAVCSS + '\n' + OVR[key] + '\n' + ROOM[key] + s[j:]
    k = s.index('<body>') + len('<body>')
    GREET = {'qian': ('tube', 415, '先擲筊請示，再抽一支籤喔。'), 'tarot': ('card', 440, '抽一張吧，牌我幫你拿好了。'), 'iching': ('coins', 401, '三枚銅錢準備好了，擲六次就成一卦。'), 'lenormand': ('crystal', 439, '三張牌連成一句話，我們一起看看。')}
    gi, gh, gt = GREET[key]
    greet = f'<div class="dg-greet{" inset" if inset else ""}"><img src="img/pig-{gi}.webp" alt="小豬" width="400" height="{gh}"><p>{gt}</p></div>'
    s = s[:k] + '\n' + nav(dst, inset) + hrow(key, inset) + greet + s[k:]
    if key == 'tarot':
        s = re.sub(r'<header class="top">.*?</header>', '', s, count=1, flags=re.S)
        s = sub1(s, '<section id="v-hist" hidden></section>', '<section id="v-hist" hidden></section>' + TAROT_LEARN)
        s = sub1(s, '<button class="link" data-act="copy">複製解讀</button>', '<button class="btn ghost" data-act="share">分享結果連結</button><button class="btn ghost" data-act="imgcard">做成圖卡</button><button class="link" data-act="copy">複製解讀</button>')
        s = sub1(s, "return t+'\\n整體：\\n'+out.join('\\n');", "return t+'\\n整體：\\n'+out.join('\\n')+'\\n\\n'+shareURL(r);")
        s = sub1(s, '\nrenderSetup();\n</script>', '\n' + COMMON_JS + open('ext-card.js',encoding='utf8').read() + open('ext-ui.js',encoding='utf8').read() + open('ext-tarot.js',encoding='utf8').read() + open('ext-tarot-ui.js',encoding='utf8').read() + TAROT_JS + '</script>')
    if key == 'iching':
        s = re.sub(r'<header class="head">.*?</header>', '', s, count=1, flags=re.S)
        s = sub1(s, '<main id="v-cast"></main>', '<div class="dg-hero" id="ic-hero"><div class="dg-eb">I CHING</div><h1>想問什麼方向？</h1><p>心裡想著一件事，選一種方式起卦。易經會告訴你現在的狀態，和接下來的走向。</p></div><main id="v-cast"></main><main id="v-lib" hidden></main>')
        s = sub1(s, '<main id="v-hist" hidden></main>', '<main id="v-hist" hidden></main>' + ICHING_LEARN)
        s = sub1(s, '<button class="btn ghost" data-act="copy">複製結果</button>', '<button class="btn ghost" data-act="share">分享結果連結</button><button class="btn ghost" data-act="imgcard">做成圖卡</button><button class="btn ghost" data-act="copy">複製結果</button>')
        s = sub1(s, "建議：${ben.adv}`;", "建議：${ben.adv}\\n\\n`+shareURL(r);")
        s = sub1(s, '\nrender();\n</script>', '\n' + COMMON_JS + open('ext-card.js',encoding='utf8').read() + open('ext-ui.js',encoding='utf8').read() + open('ext-iching-card.js',encoding='utf8').read() + open('ext-iching-ui.js',encoding='utf8').read() + ICHING_JS + '</script>')
    if key == 'lenormand':
        s = re.sub(r'<header>\s*<h1>雷諾曼小抽屜</h1>\s*<p class="lead">(.*?)</p>\s*(<ol class="steps">.*?</ol>)\s*</header>', lambda m: '<div class="dg-hero" id="lv-hero"><div class="dg-eb">LENORMAND</div><h1>最近會怎樣？</h1><p>' + m.group(1) + '</p>' + m.group(2).replace(' class="steps"', '') + '</div>', s, count=1, flags=re.S)
        s = re.sub(r'<details class="learn">.*?</details>\s*<details id="gallery">.*?</details>', '<section id="lv-lib" hidden></section><section id="lv-hist" hidden></section>' + LENO_LEARN + '<div id="grid" hidden></div>', s, count=1, flags=re.S)
        s = sub1(s, 'html+=`<button class="btn again" id="againBtn">再抽一次</button>`;', 'html+=`<div class="acts"><button class="btn again" id="againBtn">再抽一次</button><button class="btn" id="shareBtn">分享結果連結</button><button class="btn" id="cardBtn">做成圖卡</button></div>`;')
        s = re.sub(r'\s*<footer>.*?</footer>', '', s, count=1, flags=re.S)
        s = sub1(s, '\nnewRound();\n</script>', '\n' + COMMON_JS + open('ext-card.js',encoding='utf8').read() + open('ext-ui.js',encoding='utf8').read() + open('ext-leno.js',encoding='utf8').read() + open('ext-leno-ui.js',encoding='utf8').read() + LENO_JS + '</script>')
        s = sub1(s, 'aria-label="你的問題">', 'aria-label="你的問題">\n    <div class="dg-topics" role="group" aria-label="想問哪方面"><span>想問哪方面</span><button type="button" data-t="general" aria-pressed="true">整體</button><button type="button" data-t="love" aria-pressed="false">感情</button><button type="button" data-t="work" aria-pressed="false">工作</button><button type="button" data-t="money" aria-pressed="false">財運</button></div>')
    s = s[:s.rindex('</body>')] + FOOT + '\n' + s[s.rindex('</body>'):]
    out[dst] = s
    open(dst, 'w', encoding='utf8').write(s)

_head = open('src-leno.html', encoding='utf8').read().split('<body>')[0]
_head = re.sub(r'<style>.*?</style>', '<style>:root{box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>', _head, flags=re.S)
_qb = open('qian-body.html', encoding='utf8').read().replace('/*COMMON_JS*/', COMMON_JS + open('ext-card.js',encoding='utf8').read() + open('ext-ui.js',encoding='utf8').read())
_q = _head + f'<title>{PAGES["qian.html"][0]}</title>\n' + meta('qian.html') + NAVCSS + ROOM['qian'] + '<body>\n' + nav('qian.html') + hrow('qian') + f'<div class="dg-greet"><img src="img/pig-tube.webp" alt="小豬" width="400" height="415"><p>先擲筊請示，再抽一支籤喔。</p></div>' + '\n' + _qb + '\n' + FOOT + '\n</body></html>'
open('qian.html', 'w', encoding='utf8').write(_q)
out['qian.html'] = _q
open('theme.css', 'w').write(FONTS)
open('stats.js', 'w').write(STATS_JS)

# ---- hub ----
hub = open('hub.html', encoding='utf8').read()

# ---- font subset ----
chars = set()
for s in list(out.values()) + [hub]:
    s = re.sub(r'const (STROKES|RADS)=".*?";', '', s, flags=re.S)
    chars |= set(s)
chars |= set('０１２３４５６７８９，。、；：？！「」『』（）…—～·・＋−×○')
chars |= set(chr(c) for c in range(0x20, 0x7f))
open(SCR + 'chars.txt', 'w', encoding='utf8').write(''.join(sorted(chars)))
for w, f in [('r', 'GenSenRounded2TW-R.otf'), ('b', 'GenSenRounded2TW-B.otf')]:
    subprocess.run(['pyftsubset', FS + f, '--text-file=' + SCR + 'chars.txt', '--flavor=woff2', f'--output-file=fonts/gensen-{w}.woff2', '--layout-features=*', '--no-hinting'], check=True)

import json
open('manifest.webmanifest','w',encoding='utf8').write(json.dumps({'name':'問問小豬','short_name':'問問小豬','description':PAGES['index.html'][1],'start_url':'./','scope':'./','display':'standalone','background_color':'#f8f1f0','theme_color':'#f8f1f0','lang':'zh-Hant-TW','icons':[{'src':'img/icon-192.png','sizes':'192x192','type':'image/png'},{'src':'img/icon-512.png','sizes':'512x512','type':'image/png'}]},ensure_ascii=False,indent=1))
open('404.html','w',encoding='utf8').write(f'''<!doctype html><html lang="zh-Hant-TW"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>找不到這一頁｜問問小豬</title><link rel="icon" href="{DOM}/img/favicon.png" type="image/png">
<style>@font-face{{font-family:"GenSenRounded";font-weight:700;src:url({DOM}/fonts/gensen-b.woff2) format("woff2")}}
{TOKENS}
body{{margin:0;min-height:100vh;display:grid;place-items:center;background:var(--dg-bg);color:var(--dg-ink);font-family:var(--round);text-align:center;padding:24px}}
img{{width:140px;height:auto}}h1{{font-size:26px;margin:14px 0 6px}}p{{color:var(--dg-soft);margin:0 0 22px}}
a{{display:inline-block;background:var(--dg-ink);color:var(--dg-bg);text-decoration:none;font-weight:700;border-radius:16px;padding:13px 26px}}</style></head>
<body><main><img src="{DOM}/img/pig-tired.webp" alt="累到趴下的小豬"><h1>小豬找不到這一頁</h1><p>牠找了好久，累到趴下了。</p><a href="{DOM}/">回到首頁</a></main></body></html>''')
open('README.md','w',encoding='utf8').write('''# 問問小豬

塔羅、易經、雷諾曼三合一的線上占卜小網站，吉祥物是 may22 畫的粉紅小豬。

- `index.html` 首頁
- `tarot.html` 塔羅牌（78 張萊德偉特，牌面圖在 `cards/`）
- `iching.html` 易經起卦
- `lenormand.html` 雷諾曼
- `stats.js` 匿名統計（寫進 Google 試算表，網址填在檔案最上面）

字型：源泉圓體（GenSenRounded），SIL Open Font License，授權見 `fonts/OFL.txt`。

by may22
''')

# ---- output folder ----
head = open('src-leno.html', encoding='utf8').read().split('<body>')[0]
head = re.sub(r'<style>.*?</style>', '<style>:root{box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>', head, flags=re.S)
h = hub
h = re.sub(r'<title>[^<]*</title>', f'<title>{PAGES["index.html"][0]}</title>', h, count=1)
i = h.index('</title>') + len('</title>')
h = h[:i] + '\n' + meta('index.html') + h[i:]
h = h.replace('<link rel="stylesheet" href="theme.css">\n<script src="stats.js"></script>\n', '', 1)
OUTD='site'; shutil.rmtree(OUTD, ignore_errors=True); shutil.rmtree('netlify', ignore_errors=True); os.makedirs(OUTD)
open(OUTD+'/index.html', 'w', encoding='utf8').write(head + '<body>\n' + h + '\n</body></html>')
for f in ['tarot.html', 'iching.html', 'lenormand.html', 'qian.html', 'theme.css', 'stats.js', 'og-image.jpg', 'manifest.webmanifest', '404.html', 'README.md']:
    shutil.copy(f, OUTD + '/' + f)
for d in ['cards', 'fonts', 'img']:
    shutil.copytree(d, OUTD + '/' + d)
open(OUTD + '/.nojekyll', 'w').write('')
print('ok chars', len(chars))
