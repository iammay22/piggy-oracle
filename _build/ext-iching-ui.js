/* ---- iching: 卦義 library tab ---- */
let icLibF='all';
function icBars(a,cls){return `<div class="hexf ${cls||''}">${a.split('').map(y=>y==='1'?'<i><b></b></i>':'<i><b></b><b></b></i>').join('')}</div>`}
function icLib(){const f=icLibF,list=HEX.filter(h=>f==='all'||h.lv===f);
  $('#v-lib').innerHTML=`<div class="dg-hero"><div class="dg-eb">64 HEXAGRAMS</div><h1>卦義圖鑑</h1><p>點任一個卦，看卦辭、象辭，以及在運勢、感情、事業上的白話解釋。</p></div>
  <div class="dg-filters">${[['all','全部 64'],['大吉','大吉'],['吉','吉'],['平','平'],['小心','小心']].map(([k,v])=>`<button class="dg-chip" type="button" data-if="${k}" aria-pressed="${f===k}">${v}</button>`).join('')}</div>
  <div class="dg-libgrid">${list.map(h=>`<button class="dg-libc" type="button" data-ic="${h.n}"><div class="dg-face hexbox">${icBars(h.a)}</div><b>${h.n}. ${h.name}</b>${h.lv}</button>`).join('')}</div>`}
function icSheet(n){const h=HEX[n-1];dgSheet(`<div class="dg-big hexbig">${icBars(h.a,'big')}</div><h3>第${h.n}卦　${h.full}</h3><div class="dg-en">上${h.up}・下${h.lo}・${h.lv}</div>
  <p class="dg-classic">${h.ci}</p><p class="dg-sub2">象曰：${h.xiang}</p>
  <div class="dg-two"><div><h4>運勢</h4><p>${h.fort}</p></div><div><h4>感情</h4><p>${h.love}</p></div><div><h4>事業</h4><p>${h.work}</p></div><div><h4>建議</h4><p>${h.adv}</p></div></div>`)}
document.addEventListener('click',e=>{
  const tb=e.target.closest('[data-tab]');if(tb){const t=tb.dataset.tab;$('#v-lib').hidden=t!=='lib';['#ic-hero','#dg-learn'].forEach(s=>{const el=$(s);if(el)el.hidden=t!=='cast'});if(t==='lib')icLib();return}
  const f=e.target.closest('[data-if]');if(f){icLibF=f.dataset.if;icLib();return}
  const c=e.target.closest('[data-ic]');if(c)icSheet(+c.dataset.ic);
});
