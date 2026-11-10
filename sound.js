/* 問問小豬：背景音樂＋音效
   - 右下角小按鈕：點開可以分別開關「背景音樂」「音效」，設定存在這支手機
   - 每個房間一首自己的音樂（audio/music/*.mp3），音效在 audio/sfx/
   - 瀏覽器規定要先點一下畫面才能出聲，所以音樂預設開啟，會在使用者第一次點畫面時開始播
   素材：音樂 open-lofi（CC0）、音效 Kenney Interface Sounds / Casino Audio（CC0），詳見 audio/CREDITS.txt */
(function () {
  'use strict';
  var PAGE = (location.pathname.split('/').pop() || 'index.html').replace('.html', '') || 'index';
  var TRACKS = {
    index: ['home', 'Window Seat Daydream'],
    tarot: ['tarot', 'Warm Constellations'],
    iching: ['iching', 'Moon Through Bamboo'],
    lenormand: ['leno', 'Stacks of Quiet Books'],
    qian: ['qian', 'Bells Before Sunrise'],
    numerology: ['num', 'Dust on the Morning Keys']
  };
  var track = TRACKS[PAGE] || TRACKS.index;
  var base = (document.currentScript && document.currentScript.src || '').replace(/sound\.js.*$/, '') || '';
  var VOL = { music: 0.55, sfx: 0.7 };
  var SFX = { tap: .45, sw: .55, pop: .8, think: .7, chime: .75, shuffle: .8, slide: .8, place: .85, fan: .8, coins: .9, shake: .85, jiao: .9 };
  var FILES = { tap: ['tap'], sw: ['switch'], pop: ['pop'], think: ['think'], chime: ['chime'], shuffle: ['shuffle'], slide: ['slide1', 'slide2', 'slide3'],
    place: ['place1', 'place2', 'place3'], fan: ['fan'], coins: ['coins1', 'coins2', 'coins3'], shake: ['shake'], jiao: ['jiao1', 'jiao2'] };

  function get(k, d) { try { var v = localStorage.getItem('dg-' + k); return v === null ? d : v === '1'; } catch (e) { return d; } }
  function set(k, v) { try { localStorage.setItem('dg-' + k, v ? '1' : '0'); } catch (e) {} }
  var st = { music: get('music', true), sfx: get('sfx', true) };

  /* ---------- audio engine ---------- */
  var ctx = null, master = null, musicGain = null, el = null, bufs = {}, loading = false;
  function ensureCtx() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return ctx; }
    var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null;
    ctx = new AC(); master = ctx.createGain(); master.connect(ctx.destination);
    return ctx;
  }
  function loadSfx() {
    if (loading || !ensureCtx()) return; loading = true;
    Object.keys(FILES).forEach(function (k) {
      bufs[k] = [];
      FILES[k].forEach(function (f, i) {
        fetch(base + 'audio/sfx/' + f + '.mp3').then(function (r) { return r.arrayBuffer(); })
          .then(function (a) { return new Promise(function (ok, no) { ctx.decodeAudioData(a, ok, no); }); })
          .then(function (b) { bufs[k][i] = b; }).catch(function () {});
      });
    });
  }
  function play(k) {
    if (!st.sfx || !ctx || !bufs[k]) return;
    var list = bufs[k].filter(Boolean); if (!list.length) return;
    var s = ctx.createBufferSource(), g = ctx.createGain();
    s.buffer = list[Math.floor(Math.random() * list.length)];
    s.playbackRate.value = 0.96 + Math.random() * 0.08;
    g.gain.value = VOL.sfx * (SFX[k] || .6);
    s.connect(g); g.connect(master); s.start();
  }
  function musicOn() {
    if (!ensureCtx()) return;
    if (!el) {
      el = new Audio(base + 'audio/music/' + track[0] + '.mp3');
      el.loop = true; el.preload = 'auto'; el.crossOrigin = 'anonymous';
      el.addEventListener('playing', ui); el.addEventListener('pause', ui);
      try { musicGain = ctx.createGain(); musicGain.gain.value = 0; ctx.createMediaElementSource(el).connect(musicGain); musicGain.connect(master); }
      catch (e) { musicGain = null; el.volume = VOL.music; }
    }
    var p = el.play(); if (p && p.catch) p.catch(function () {});
    if (musicGain) { var t = ctx.currentTime; musicGain.gain.cancelScheduledValues(t); musicGain.gain.setValueAtTime(musicGain.gain.value, t); musicGain.gain.linearRampToValueAtTime(VOL.music, t + 1.6); }
    ui();
  }
  function musicOff(keepPref) {
    if (!el) return;
    if (musicGain && ctx) { var t = ctx.currentTime; musicGain.gain.cancelScheduledValues(t); musicGain.gain.setValueAtTime(musicGain.gain.value, t); musicGain.gain.linearRampToValueAtTime(0, t + .4); setTimeout(function () { if (!st.music || keepPref) el.pause(); }, 450); }
    else el.pause();
    ui();
  }
  function playing() { return !!(el && !el.paused && st.music); }

  /* first tap anywhere unlocks audio (browser autoplay rules) */
  var unlocked = false;
  function unlock() {
    if (unlocked) return; unlocked = true;
    ensureCtx(); loadSfx(); if (st.music) musicOn();
  }
  document.addEventListener('pointerdown', unlock, true);
  document.addEventListener('keydown', unlock, true);
  document.addEventListener('visibilitychange', function () {
    if (!el || !st.music) return;
    if (document.hidden) musicOff(true); else if (unlocked) musicOn();
  });

  /* ---------- which sound for which tap ---------- */
  function pick(t) {
    var b = t.closest && t.closest('button,a,summary,[role="tab"],label'); if (!b) return null;
    if (b.closest('.dg-snd')) return null;
    if (b.disabled || b.getAttribute('aria-disabled') === 'true') return null;
    var act = b.getAttribute('data-act') || '', id = b.id || '', txt = (b.textContent || '').trim(), c = b.classList;
    if (PAGE === 'index') {
      if (id === 'poke') return 'pop';
      if (id === 'pick') return 'think';
    }
    if (PAGE === 'tarot' || PAGE === 'lenormand') {
      if (/^(start|cut|quick|new)$/.test(act) || id === 'shuffleBtn' || id === 'againBtn' || c.contains('stack') || c.contains('pile')) return 'shuffle';
      if (act === 'draw' || act === 'auto' || c.contains('backside')) return 'slide';
      if (act === 'flip') return 'place';
      if (act === 'flip-all' || act === 'to-reading') return 'fan';
    }
    if (PAGE === 'iching') {
      if (act === 'toss') return 'coins';
      if (/^cast-/.test(act)) return 'chime';
    }
    if (PAGE === 'qian') {
      if (id === 'toss' || id === 'cf' || (id === 'next' && txt.indexOf('再擲') > -1)) return 'jiao';
      if (id === 'shake') return 'shake';
      if (id === 'next' && txt.indexOf('籤詩') > -1) return 'chime';
    }
    if (PAGE === 'numerology' && c.contains('go')) return 'chime';
    if (b.getAttribute('role') === 'tab' || b.hasAttribute('aria-selected') || b.hasAttribute('data-tab') || c.contains('chip') || c.contains('dg-chip') || act === 'method' || act === 'topic') return 'sw';
    if (b.tagName === 'A' && b.classList.contains('opt')) return 'pop';
    return 'tap';
  }
  document.addEventListener('click', function (e) { if (!unlocked) unlock(); var k = pick(e.target); if (k) play(k); }, true);

  /* ---------- the little button ---------- */
  var css = '' +
    'body{padding-bottom:calc(64px + env(safe-area-inset-bottom,0px))}' +
    '.dg-snd{position:fixed;right:max(14px,env(safe-area-inset-right,0px));bottom:calc(14px + env(safe-area-inset-bottom,0px));z-index:25;font-family:"GenSenRounded","PingFang TC","Microsoft JhengHei",sans-serif;--sb:#ffffff;--si:#2a2220;--ss:#7a6f6a;--sl:rgba(42,34,32,.12);--sa:#d9607f;--sh:rgba(80,40,50,.28)}' +
    '@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .dg-snd{--sb:#2a2624;--si:#efe8e2;--ss:#aba29b;--sl:rgba(239,232,226,.14);--sa:#f394b0;--sh:rgba(0,0,0,.55)}}' +
    ':root[data-theme="dark"] .dg-snd{--sb:#2a2624;--si:#efe8e2;--ss:#aba29b;--sl:rgba(239,232,226,.14);--sa:#f394b0;--sh:rgba(0,0,0,.55)}' +
    '.dg-snd-b{width:46px;height:46px;border-radius:50%;border:1px solid var(--sl);background:var(--sb);color:var(--si);display:grid;place-items:center;cursor:pointer;box-shadow:0 10px 24px -12px var(--sh);padding:0;-webkit-tap-highlight-color:transparent}' +
    '.dg-snd-b:focus-visible{outline:2px solid var(--sa);outline-offset:3px}.dg-snd-b svg{width:22px;height:22px}' +
    '.dg-snd-b .eq{display:none;gap:3px;align-items:flex-end;height:18px}.dg-snd-b .eq i{display:block;width:3px;border-radius:2px;background:var(--sa);height:6px}' +
    '.dg-snd.on .dg-snd-b .eq{display:flex}.dg-snd.on .dg-snd-b svg{display:none}' +
    '@media (prefers-reduced-motion:no-preference){.dg-snd.on .eq i{animation:dgeq 1s ease-in-out infinite}.dg-snd.on .eq i:nth-child(2){animation-delay:-.35s}.dg-snd.on .eq i:nth-child(3){animation-delay:-.7s}@keyframes dgeq{0%,100%{height:5px}50%{height:17px}}}' +
    '.dg-snd.on .eq i{height:12px}' +
    '.dg-snd.hint .dg-snd-b{box-shadow:0 0 0 0 var(--sa)}@media (prefers-reduced-motion:no-preference){.dg-snd.hint .dg-snd-b{animation:dgring 2.4s ease-out 3}@keyframes dgring{0%{box-shadow:0 0 0 0 color-mix(in srgb,var(--sa) 55%,transparent)}80%,100%{box-shadow:0 0 0 14px transparent}}}' +
    '.dg-snd-p{position:absolute;right:0;bottom:56px;width:228px;background:var(--sb);color:var(--si);border:1px solid var(--sl);border-radius:18px;padding:14px 16px 12px;box-shadow:0 18px 40px -18px var(--sh)}' +
    '.dg-snd-p[hidden]{display:none}.dg-snd-p b{display:block;font-size:14px;margin:0 0 6px}' +
    '.dg-snd-r{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:8px 0;font-size:15px;cursor:pointer}' +
    '.dg-snd-r+.dg-snd-r{border-top:1px solid var(--sl)}' +
    '.dg-snd-r input{appearance:none;-webkit-appearance:none;width:42px;height:24px;border-radius:999px;background:var(--sl);position:relative;margin:0;cursor:pointer;flex:none;transition:background .15s}' +
    '.dg-snd-r input::after{content:"";position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.25);transition:transform .15s}' +
    '.dg-snd-r input:checked{background:var(--sa)}.dg-snd-r input:checked::after{transform:translateX(18px)}' +
    '.dg-snd-r input:focus-visible{outline:2px solid var(--sa);outline-offset:2px}' +
    '.dg-snd-t{font-size:12px;color:var(--ss);margin:6px 0 0;line-height:1.5}';
  var root;
  function build() {
    var s = document.createElement('style'); s.textContent = css; document.head.appendChild(s);
    root = document.createElement('div'); root.className = 'dg-snd';
    root.innerHTML = '<div class="dg-snd-p" id="dgSndP" hidden role="dialog" aria-label="聲音設定"><b>聲音</b>' +
      '<label class="dg-snd-r"><span>背景音樂</span><input type="checkbox" id="dgSndM"></label>' +
      '<label class="dg-snd-r"><span>音效</span><input type="checkbox" id="dgSndS"></label>' +
      '<p class="dg-snd-t">這一頁的音樂：' + track[1] + '</p></div>' +
      '<button class="dg-snd-b" type="button" aria-expanded="false" aria-controls="dgSndP" aria-label="聲音設定"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/></svg><span class="eq" aria-hidden="true"><i></i><i></i><i></i></span></button>';
    document.body.appendChild(root);
    var btn = root.querySelector('.dg-snd-b'), pan = root.querySelector('.dg-snd-p'), m = root.querySelector('#dgSndM'), x = root.querySelector('#dgSndS');
    m.checked = st.music; x.checked = st.sfx;
    function close() { pan.hidden = true; btn.setAttribute('aria-expanded', 'false'); }
    btn.addEventListener('click', function () {
      root.classList.remove('hint');
      var open = pan.hidden; pan.hidden = !open; btn.setAttribute('aria-expanded', String(open));
    });
    m.addEventListener('change', function () { st.music = m.checked; set('music', st.music); if (st.music) musicOn(); else musicOff(); try { window.dgTrack && window.dgTrack('sound/music/' + (st.music ? 'on' : 'off')); } catch (e) {} });
    x.addEventListener('change', function () { st.sfx = x.checked; set('sfx', st.sfx); if (st.sfx) { loadSfx(); setTimeout(function () { play('pop'); }, 60); } });
    document.addEventListener('click', function (e) { if (!pan.hidden && !root.contains(e.target)) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !pan.hidden) { close(); btn.focus(); } });
    ui();
  }
  function ui() { if (root) root.classList.toggle('on', playing()); }
  if (document.body) build(); else document.addEventListener('DOMContentLoaded', build);
  window.dgSound = { play: function (k) { play(k); } };
})();
