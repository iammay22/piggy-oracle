
/* ---- 問問小豬: shared tabs, sheet, history helpers ---- */
function dgSheet(html){let s=document.querySelector('.dg-scrim');if(s)s.remove();
  s=document.createElement('div');s.className='dg-scrim';
  s.innerHTML=`<div class="dg-bsheet" role="dialog" aria-modal="true"><button class="dg-sx" type="button" aria-label="關閉">✕</button>${html}</div>`;
  document.body.appendChild(s);s.addEventListener('click',e=>{if(e.target===s||e.target.closest('.dg-sx'))s.remove()});}
document.addEventListener('keydown',e=>{if(e.key==='Escape'){const s=document.querySelector('.dg-scrim');if(s)s.remove()}});
const dgStore={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
function dgEsc(s){return String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function dgWhen(t){try{return new Date(t).toLocaleString('zh-TW',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'})}catch(e){return ''}}
/* views: {draw:[els], lib:[els], hist:[els]} ; onShow(name) */
function dgTabs(views,onShow){
  document.addEventListener('click',e=>{const b=e.target.closest('[data-dgtab]');if(!b)return;const t=b.dataset.dgtab;
    document.querySelectorAll('[data-dgtab]').forEach(x=>x.setAttribute('aria-selected',x===b));
    Object.entries(views).forEach(([k,els])=>els().forEach(el=>{if(el)el.hidden=k!==t}));
    if(onShow)onShow(t);window.scrollTo({top:0})});
}
function dgHistHTML(list,row,empty){
  if(!list.length)return `<div class="dg-empty">${empty}</div>`;
  return `<div class="dg-hist">${list.map((r,i)=>`<button class="dg-hi" type="button" data-hopen="${i}">${row(r)}<span class="dg-go" aria-hidden="true">›</span></button>`).join('')}</div>
  <div class="dg-center"><button class="dg-link" type="button" data-hclear>清除全部紀錄</button></div>`;
}
