function ichingCardSpec(r){const ben=hexOf(r.vals),bian=hexOf(r.vals,true),mv=r.vals.some(v=>v===6||v===9),k=keyReading(r.vals),strip=s=>String(s||'').replace(/<[^>]+>/g,'');
  const it=k.items&&k.items[0];
  return {eyebrow:'易經・'+MNAME[r.method],title:mv?`${ben.name}　→　${bian.name}`:ben.full,q:r.q,pig:'img/pig-coins.webp',msgTitle:'小豬想說',msg:ben.adv+(it?' '+strip(it.gl):''),
    body:async(x,{top,W,T})=>{const bw=230,bh=30,g=22;
      const draw=(h,cx,label,mark)=>{const bits=h.a.split('');
        for(let i=0;i<6;i++){const y=top+60+(5-i)*(bh+g),m=mark&&(r.vals[i]===6||r.vals[i]===9);x.fillStyle=m?'#c23a2c':T.ink;
          if(bits[i]==='1'){dgRR(x,cx-bw/2,y,bw,bh,6);x.fill()}else{dgRR(x,cx-bw/2,y,bw*.42,bh,6);x.fill();dgRR(x,cx+bw/2-bw*.42,y,bw*.42,bh,6);x.fill()}}
        x.textAlign='center';x.fillStyle=T.soft;x.font=`400 28px ${DG_F}`;x.fillText(label,cx,top+36);
        x.fillStyle=T.ink;x.font=`700 44px ${DG_F}`;x.fillText(h.full,cx,top+60+6*(bh+g)+52);
        x.fillStyle=T.acc;x.font=`700 28px ${DG_F}`;x.fillText(h.lv,cx,top+60+6*(bh+g)+96)};
      if(mv){draw(ben,W/2-220,'本卦',true);draw(bian,W/2+220,'變卦',false);x.fillStyle=T.soft;x.font=`700 48px ${DG_F}`;x.textAlign='center';x.fillText('→',W/2,top+60+3*(bh+g))}
      else draw(ben,W/2,'本卦',false);
      if(it){x.textAlign='center';x.fillStyle=T.ink;x.font=`700 34px ${DG_F}`;dgWrap(x,strip(it.src),W/2,top+570,820,46,2)}
      x.textAlign='left'}}}
document.addEventListener('click',e=>{if(e.target.closest('[data-act="imgcard"]')&&S.res)dgShowCard(ichingCardSpec(S.res),'問問小豬-易經')});
