/* ---- 問問小豬: 新版整張圖卡（照求籤圖卡的風格） ---- */
const DG_PUNCT='，。、！？；：」』）…～,.!?;:)';
function dgLines(x,text,maxW){const out=[];
  for(const para of String(text).split('\n')){let line='';
    for(const ch of para){if(x.measureText(line+ch).width>maxW&&line&&!DG_PUNCT.includes(ch)){let carry='';while(line.length>1&&'「『（('.includes(line.slice(-1))){carry=line.slice(-1)+carry;line=line.slice(0,-1)}out.push(line);line=carry+ch}else line+=ch}
    out.push(line)}
  return out}
/* 字多就縮小，縮到最小還放不下才截斷 */
function dgFit(x,text,maxW,maxH,size,minSize,lhR,weight){
  for(let fs=size;fs>=minSize;fs-=2){x.font=`${weight||400} ${fs}px ${DG_F}`;const L=dgLines(x,text,maxW);
    if(L.length*fs*lhR<=maxH)return {fs,lines:L,lh:fs*lhR}}
  const fs=minSize,lh=fs*lhR;x.font=`${weight||400} ${fs}px ${DG_F}`;let L=dgLines(x,text,maxW);const k=Math.max(1,Math.floor(maxH/lh));
  if(L.length>k){L=L.slice(0,k);let l=L[k-1];while(l&&x.measureText(l+'…').width>maxW)l=l.slice(0,-1);L[k-1]=l+'…'}
  return {fs,lines:L,lh}}
const DG_PAL={
  tarot:{g1:'#d8ccf2',g2:'#f1ecfb',paper:'#ffffff',ink:'#2b2540',soft:'#6f6889',acc:'#6a55b0',glow:'rgba(106,85,176,.28)',dim:'#8d86a3'},
  iching:{g1:'#f5dcc0',g2:'#fcf3e6',paper:'#fffaf2',ink:'#2b2420',soft:'#7a6c5d',acc:'#a8322a',glow:'rgba(150,80,30,.22)',dim:'#8a7f72'},
  leno:{g1:'#f7d9cc',g2:'#fdf2ea',paper:'#fffdfb',ink:'#3a2a2a',soft:'#7a6863',acc:'#c0536f',glow:'rgba(180,80,90,.22)',dim:'#8b7d76'},
  num:{g1:'#cde2f8',g2:'#eef6fe',paper:'#ffffff',ink:'#1f2b38',soft:'#5a6a7b',acc:'#2f72ad',glow:'rgba(47,114,173,.22)',dim:'#7b8a99'}};
const DG_SPARK=[[66,150,20,0],[1012,118,24,1],[150,300,11,2],[958,286,14,3],[48,520,15,1],[1034,560,19,0],[96,770,11,3],[1000,812,14,2],[44,1010,13,0],[1040,1040,17,1],[200,86,11,3],[884,64,12,2],[262,236,9,1],[826,222,10,0],[1046,330,9,3],[34,330,9,2]];
function dgSparkle(x,cx,cy,r){x.beginPath();x.moveTo(cx,cy-r);x.quadraticCurveTo(cx,cy,cx+r,cy);x.quadraticCurveTo(cx,cy,cx,cy+r);x.quadraticCurveTo(cx,cy,cx-r,cy);x.quadraticCurveTo(cx,cy,cx,cy-r);x.closePath();x.fill()}
function dgBackdrop(x,C,W,H){
  const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,C.g1);g.addColorStop(.55,C.g2);g.addColorStop(1,C.g2);x.fillStyle=g;x.fillRect(0,0,W,H);
  const r=x.createRadialGradient(W/2,330,40,W/2,330,640);r.addColorStop(0,'rgba(255,255,255,.55)');r.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=r;x.fillRect(0,0,W,H);
  // 拱門
  x.save();x.beginPath();x.moveTo(40,H+10);x.lineTo(40,330);x.bezierCurveTo(40,120,250,40,W/2,40);x.bezierCurveTo(W-250,40,W-40,120,W-40,330);x.lineTo(W-40,H+10);x.closePath();
  x.fillStyle='rgba(255,255,255,.32)';x.fill();x.strokeStyle='rgba(255,255,255,.85)';x.lineWidth=3;x.stroke();x.restore();
  // 星星
  const cols=[C.acc,'#f39ab9','#8fbcec','#f2c063'];
  x.save();DG_SPARK.forEach(([sx,sy,sr,ci])=>{x.globalAlpha=.75;x.shadowColor='rgba(255,255,255,.9)';x.shadowBlur=10;x.fillStyle=cols[ci];dgSparkle(x,sx,sy,sr)});x.restore();
}
function dgFrameCard(x,C,im,cx,cy,w,h,rev){x.save();x.translate(cx,cy);
  x.shadowColor=C.glow;x.shadowBlur=26;x.shadowOffsetY=8;x.fillStyle='#fff';dgRR(x,-w/2-9,-h/2-9,w+18,h+18,16);x.fill();x.shadowColor='transparent';
  if(rev)x.rotate(Math.PI);dgRR(x,-w/2,-h/2,w,h,8);x.clip();if(im)x.drawImage(im,-w/2,-h/2,w,h);else{x.fillStyle='#ddd';x.fillRect(-w/2,-h/2,w,h)}x.restore()}
function dgGlass(x,C,bx,by,bw,bh,r){x.save();x.shadowColor=C.glow;x.shadowBlur=30;x.shadowOffsetY=10;x.fillStyle='rgba(255,255,255,.62)';dgRR(x,bx,by,bw,bh,r);x.fill();x.restore();
  x.strokeStyle='rgba(255,255,255,.95)';x.lineWidth=2.5;dgRR(x,bx,by,bw,bh,r);x.stroke()}
function dgPill(x,text,cx,y,bg,fg,fs){x.font=`700 ${fs||30}px ${DG_F}`;const h=Math.round((fs||30)*1.8),w=x.measureText(text).width+h*1.1;
  x.fillStyle=bg;dgRR(x,cx-w/2,y,w,h,h/2);x.fill();x.fillStyle=fg;x.textAlign='center';x.fillText(text,cx,y+h*.68);return h}
/* o: {C, eyebrow, title, chip:{t,c}, visual:async(x,top)=>bottom, q, label, body, say, pig} */
async function dgPoster(x,{W,H},o){
  const C=o.C;dgBackdrop(x,C,W,H);x.textBaseline='alphabetic';x.textAlign='center';
  x.fillStyle=C.acc;x.font=`700 34px ${DG_F}`;x.fillText(o.eyebrow,W/2,112);
  let fs=70;x.font=`700 ${fs}px ${DG_F}`;while(x.measureText(o.title).width>W-160&&fs>44){fs-=2;x.font=`700 ${fs}px ${DG_F}`}
  x.fillStyle=C.ink;x.fillText(o.title,W/2,196);
  let y=226;if(o.chip){y+=dgPill(x,o.chip.t,W/2,y,o.chip.c||C.acc,'#fff',30)}
  y=await o.visual(x,y+40);x.textAlign='center';
  if(o.q){y+=58;x.fillStyle=C.soft;x.font=`400 34px ${DG_F}`;let q=o.q;while(x.measureText('「'+q+'」').width>W-200&&q.length>2)q=q.slice(0,-2)+'…';x.fillText('「'+q+'」',W/2,y);y+=34}else y+=40;
  // 解讀框
  const bx=84,bw=W-168,by=y,bh=H-116-by;dgGlass(x,C,bx,by,bw,bh,36);
  const pig=o.pig?await dgImg(o.pig):null,pgw=180;let ph=0;if(pig){ph=pig.height*pgw/pig.width;x.drawImage(pig,bx+bw-pgw-14,by+bh-ph-8,pgw,ph)}
  x.textAlign='left';const tx=bx+40,tw=bw-80-(pig?pgw-10:0);
  x.fillStyle=C.acc;x.font=`700 34px ${DG_F}`;x.fillText(o.label,tx,by+62);
  let sayH=0,sayL=null;if(o.say){sayL=dgFit(x,o.say,tw,80,28,24,1.4,700);sayH=sayL.lines.length*sayL.lh+20}
  const fit=dgFit(x,o.body,tw,bh-96-sayH-12,36,26,1.45);x.fillStyle=C.ink;x.font=`400 ${fit.fs}px ${DG_F}`;
  fit.lines.forEach((l,i)=>x.fillText(l,tx,by+112+i*fit.lh));
  if(sayL){x.fillStyle=C.soft;x.font=`700 ${sayL.fs}px ${DG_F}`;const y0=by+bh-34-(sayL.lines.length-1)*sayL.lh;sayL.lines.forEach((l,i)=>x.fillText(l,tx,y0+i*sayL.lh))}
  // 頁尾
  x.font=`700 26px ${DG_F}`;x.fillStyle=C.soft;x.fillText('問問小豬',90,H-56);const w1=x.measureText('問問小豬　').width;x.font=`400 24px ${DG_F}`;x.fillText(DG_SITE,90+w1,H-56);
  x.textAlign='right';x.fillText('by may22',W-90,H-56);x.textAlign='left';
}

