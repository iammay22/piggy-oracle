
/* ---- 問問小豬: shareable result image card ---- */
const DG_SITE='iammay22.github.io/piggy-oracle';
function dgVar(n,fb){try{return getComputedStyle(document.documentElement).getPropertyValue(n).trim()||fb}catch(e){return fb}}
function dgImg(src){return new Promise(r=>{const i=new Image();i.onload=()=>r(i);i.onerror=()=>r(null);i.src=src})}
function dgWrap(ctx,text,x,y,maxW,lh,maxLines){
  const out=[];let line='';
  for(const ch of String(text)){if(ch==='\n'){out.push(line);line='';continue}
    if(ctx.measureText(line+ch).width>maxW&&line){out.push(line);line=ch}else line+=ch}
  if(line)out.push(line);
  const shown=out.slice(0,maxLines);if(out.length>maxLines){let l=shown[maxLines-1];while(ctx.measureText(l+'…').width>maxW&&l.length)l=l.slice(0,-1);shown[maxLines-1]=l+'…'}
  shown.forEach((l,i)=>ctx.fillText(l,x,y+i*lh));return shown.length*lh;
}
function dgRR(ctx,x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}
const DG_F='"GenSenRounded","PingFang TC","Microsoft JhengHei",sans-serif';
async function dgMakeCard(spec){
  try{await Promise.all([document.fonts.load('700 40px GenSenRounded'),document.fonts.load('400 40px GenSenRounded')])}catch(e){}
  const W=1080,H=1350,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');
  const T={bg:dgVar('--dg-bg','#f8f1f0'),sf:dgVar('--dg-surface','#fff'),s2:dgVar('--dg-surface-2','#f1e7e5'),ink:dgVar('--dg-ink','#2a2022'),soft:dgVar('--dg-soft','#6f6265'),acc:dgVar('--dg-acc','#b84d6c'),line:dgVar('--dg-line','#ead9d6')};
  x.fillStyle=T.bg;x.fillRect(0,0,W,H);
  x.fillStyle=T.acc;x.globalAlpha=.07;for(let i=0;i<26;i++){x.beginPath();x.arc((i*397)%W,(i*263)%H,6+(i%4)*3,0,7);x.fill()}x.globalAlpha=1;
  x.fillStyle=T.sf;dgRR(x,54,54,W-108,H-108,52);x.fill();x.strokeStyle=T.line;x.lineWidth=3;x.stroke();
  x.textBaseline='alphabetic';x.textAlign='center';
  x.fillStyle=T.acc;x.font=`700 34px ${DG_F}`;x.fillText(spec.eyebrow,W/2,148);
  x.fillStyle=T.ink;x.font=`700 60px ${DG_F}`;x.fillText(spec.title,W/2,224);
  if(spec.q){x.fillStyle=T.soft;x.font=`400 34px ${DG_F}`;let q=spec.q;if(q.length>22)q=q.slice(0,21)+'…';x.fillText('「'+q+'」',W/2,280)}
  await spec.body(x,{top:320,bottom:960,W,T});
  // message
  x.textAlign='left';const mx=110,mw=600;let my=1010;
  x.fillStyle=T.s2;dgRR(x,90,975,W-180,210,32);x.fill();
  x.fillStyle=T.acc;x.font=`700 32px ${DG_F}`;x.fillText(spec.msgTitle||'小豬想說',mx,my+18);
  x.fillStyle=T.ink;x.font=`400 34px ${DG_F}`;dgWrap(x,spec.msg,mx,my+70,mw,48,3);
  const pig=await dgImg(spec.pig);if(pig){const pw=270,ph=pig.height*pw/pig.width;x.drawImage(pig,W-pw-70,1185-ph+20,pw,ph)}
  x.fillStyle=T.soft;x.font=`700 28px ${DG_F}`;x.fillText('問問小豬',90,1252);x.font=`400 26px ${DG_F}`;x.fillText(DG_SITE,90,1288);
  x.textAlign='right';x.fillText('by may22',W-90,1288);
  return new Promise(r=>c.toBlob(b=>r(b),'image/png'));
}
async function dgShowCard(spec,name){
  dgT(location.pathname.replace(/^.*\//,'').replace('.html','')+'/imgcard');
  let m=document.querySelector('.dg-modal');if(m)m.remove();
  m=document.createElement('div');m.className='dg-modal';m.innerHTML='<div class="dg-sheet"><p class="dg-wait">小豬正在畫圖卡……</p></div>';document.body.appendChild(m);
  m.addEventListener('click',e=>{if(e.target===m||e.target.closest('.dg-x'))m.remove()});
  const blob=await dgMakeCard(spec);if(!blob){m.querySelector('.dg-sheet').innerHTML='<p>這個瀏覽器做不出圖卡，請改用截圖。</p><button class="dg-x">關閉</button>';return}
  const url=URL.createObjectURL(blob),file=new File([blob],(name||'問問小豬')+'.png',{type:'image/png'});
  const canShare=!!(navigator.canShare&&navigator.canShare({files:[file]}));
  m.querySelector('.dg-sheet').innerHTML=`<img src="${url}" alt="占卜結果圖卡"><p class="dg-tip">手機可以長按圖片存到相簿</p><div class="dg-acts2">${canShare?'<button class="dg-b" id="dgShareImg">分享圖片</button>':''}<a class="dg-b ghost" href="${url}" download="${(name||'問問小豬')}.png">存成圖片</a><button class="dg-b ghost dg-x">關閉</button></div>`;
  const s=m.querySelector('#dgShareImg');if(s)s.onclick=()=>navigator.share({files:[file],title:'問問小豬',text:'我的占卜結果｜'+DG_SITE}).catch(()=>{});
}
async function dgDrawCardImg(x,src,cx,cy,w,h,rev){const im=await dgImg(src);x.save();x.translate(cx,cy);if(rev)x.rotate(Math.PI);
  x.shadowColor='rgba(0,0,0,.18)';x.shadowBlur=18;x.shadowOffsetY=8;dgRR(x,-w/2,-h/2,w,h,14);x.fillStyle='#fff';x.fill();x.shadowColor='transparent';x.clip();
  if(im)x.drawImage(im,-w/2,-h/2,w,h);else{x.fillStyle='#ddd';x.fillRect(-w/2,-h/2,w,h)}x.restore()}
