/* ---- leno: library + history tabs ---- */
let lenoLibF='all',dgOpening=false;
function lenoLib(){const f=lenoLibF,list=D.filter(c=>f==='all'||(f==='y'?/是/.test(c.yn):f==='n'?/否/.test(c.yn):c.yn==='看情況'));
  $("lv-lib").innerHTML=`<div class="dg-hero"><div class="dg-eb">36 CARDS</div><h1>牌義圖鑑</h1><p>點任一張牌，看它的意思，還有在感情、工作、財運上的說法。</p></div>
  <div class="dg-filters">${[['all','全部 36'],['y','偏「是」'],['m','看情況'],['n','偏「否」']].map(([k,v])=>`<button class="dg-chip" type="button" data-lf="${k}" aria-pressed="${f===k}">${v}</button>`).join('')}</div>
  <div class="dg-libgrid">${list.map(c=>`<button class="dg-libc" type="button" data-lc="${c.n}"><div class="dg-face leno">${cardSVG(c)}</div><b>${c.name}</b>${c.first}</button>`).join('')}</div>`}
function lenoSheet(n){const c=D[n-1];dgSheet(`<div class="dg-big leno">${cardSVG(c)}</div><h3>${c.n}. ${c.name}</h3><div class="dg-en">${c.en}・${c.pip}</div>
  <div class="dg-kws">${c.k.split('、').map(k=>`<span>${k}</span>`).join('')}<span>傾向：${c.yn}</span></div>
  <div class="dg-two"><div><h4>感情</h4><p>${LT[n][0]}</p></div><div><h4>工作</h4><p>${LT[n][1]}</p></div><div><h4>財運</h4><p>${LT[n][2]}</p></div><div><h4>小豬提醒</h4><p>${c.tip}</p></div></div>`)}
function lenoSave(){const h=dgStore.get('leno-history',[]);h.unshift({t:Date.now(),q:$("question").value.trim(),topic:dgTopic,ns:picked.map(c=>c.n)});dgStore.set('leno-history',h.slice(0,60))}
function lenoHist(){const h=dgStore.get('leno-history',[]);
  $("lv-hist").innerHTML=`<div class="dg-hero"><div class="dg-eb">HISTORY</div><h1>抽牌紀錄</h1><p>只存在這台裝置上，點一筆可以重看當時的解讀。</p></div>`+
  dgHistHTML(h,r=>`<span class="dg-ht"><b>${r.q?dgEsc(r.q):'沒有寫下問題'}</b><span>${r.ns.map(n=>D[n-1].name).join('・')}</span><span>${TN[r.topic]||'整體'}・${dgWhen(r.t)}</span></span>`,'還沒有紀錄。<br>抽完牌之後，會自動存在這台裝置上。')}
function lenoOpen(r){mode=r.ns.length;$("m1").setAttribute("aria-pressed",mode===1);$("m3").setAttribute("aria-pressed",mode===3);newRound();
  picked=r.ns.map(n=>D[n-1]);$("question").value=r.q||'';dgSetTopic(r.topic);drawSlots();picked.forEach((_,i)=>$("cx"+i).classList.add("on"));updateStatus();
  dgOpening=true;showReading();dgOpening=false}
document.addEventListener('click',e=>{
  const f=e.target.closest('[data-lf]');if(f){lenoLibF=f.dataset.lf;lenoLib();return}
  const c=e.target.closest('[data-lc]');if(c){lenoSheet(+c.dataset.lc);return}
  const o=e.target.closest('#lv-hist [data-hopen]');if(o){const r=dgStore.get('leno-history',[])[+o.dataset.hopen];if(r){document.querySelector('[data-dgtab="draw"]').click();lenoOpen(r)}return}
  const x=e.target.closest('#lv-hist [data-hclear]');if(x){if(x.dataset.sure){dgStore.set('leno-history',[]);lenoHist()}else{x.dataset.sure=1;x.textContent='再點一次，確定清除'}}
});
dgTabs({draw:()=>[$("lv-hero"),document.querySelector('.play'),$("dg-learn")],lib:()=>[$("lv-lib")],hist:()=>[$("lv-hist")]},t=>{if(t==='lib')lenoLib();if(t==='hist')lenoHist()});
