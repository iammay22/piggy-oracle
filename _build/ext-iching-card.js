/* ================= 易經 ================= */
function ichingFull(r){const C=DG_PAL.iching,ben=hexOf(r.vals),bian=hexOf(r.vals,true),mv=r.vals.some(v=>v===6||v===9),k=keyReading(r.vals),it=k.items[0],strip=s=>String(s||'').replace(/<[^>]+>/g,'');
  const LV={吉:'#a8322a',平:'#a77a2a',凶:'#5d6470'};
  return async(x,{W,H})=>dgPoster(x,{W,H},{C,eyebrow:'我的易經・'+MNAME[r.method],title:mv?`${ben.name}　→　${bian.name}`:ben.full,chip:{t:k.why+'・'+k.hint.replace(/^看/,'看')},q:r.q,
    label:'白話來說',body:strip(it.gl),say:'小豬想說：'+ben.adv,pig:'img/pig-coins.webp',
    visual:async(x,top)=>{const bw=mv?220:250,bh=26,g=16;
      const draw=(h,cx,lab,mark)=>{const bits=h.a.split('');x.textAlign='center';x.fillStyle=C.soft;x.font=`400 26px ${DG_F}`;x.fillText(lab,cx,top+24);
        for(let i=0;i<6;i++){const yy=top+48+(5-i)*(bh+g),m=mark&&(r.vals[i]===6||r.vals[i]===9);x.fillStyle=m?C.acc:C.ink;
          if(bits[i]==='1'){dgRR(x,cx-bw/2,yy,bw,bh,6);x.fill()}else{dgRR(x,cx-bw/2,yy,bw*.42,bh,6);x.fill();dgRR(x,cx+bw/2-bw*.42,yy,bw*.42,bh,6);x.fill()}
          if(m){x.beginPath();x.arc(cx+bw/2+26,yy+bh/2,8,0,7);x.fill()}}
        const ny=top+48+6*(bh+g)+40;x.fillStyle=C.ink;x.font=`700 40px ${DG_F}`;x.fillText(h.full,cx,ny);
        x.font=`700 24px ${DG_F}`;const pw=x.measureText(h.lv).width+36;x.fillStyle=h.lv.includes('凶')?LV['凶']:h.lv.includes('吉')?LV['吉']:LV['平'];dgRR(x,cx-pw/2,ny+16,pw,40,20);x.fill();x.fillStyle='#fff';x.fillText(h.lv,cx,ny+44)};
      if(mv){draw(ben,W/2-230,'本卦・現在',true);draw(bian,W/2+230,'變卦・之後',false);x.fillStyle=C.soft;x.font=`700 48px ${DG_F}`;x.textAlign='center';x.fillText('→',W/2,top+48+3*(bh+g)+14)}
      else draw(ben,W/2,'本卦',false);
      // 原文
      let y=top+48+6*(bh+g)+122;const pw=W-220,px=110;x.font=`700 36px ${DG_F}`;const L=dgLines(x,strip(it.src),pw-80).slice(0,3),ph=56+L.length*52;
      x.save();x.shadowColor=C.glow;x.shadowBlur=22;x.shadowOffsetY=8;x.fillStyle=C.paper;dgRR(x,px,y,pw,ph,ph/2.4);x.fill();x.restore();
      x.strokeStyle=C.acc;x.globalAlpha=.55;x.lineWidth=2;dgRR(x,px+10,y+10,pw-20,ph-20,(ph-20)/2.4);x.stroke();x.globalAlpha=1;
      x.fillStyle=C.ink;x.textAlign='center';const y0=y+ph/2-(L.length-1)*26+13;L.forEach((l,i)=>x.fillText(l,W/2,y0+i*52));
      return y+ph}})}

function ichingCardSpec(r){return {full:ichingFull(r)}}
document.addEventListener('click',e=>{if(e.target.closest('[data-act="imgcard"]')&&S.res)dgShowCard(ichingCardSpec(S.res),'問問小豬-易經')});
