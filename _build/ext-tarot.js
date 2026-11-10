
/* ---- 問問小豬: richer tarot reading ---- */
const MAJ_MONEY=['適合嘗試新的賺錢方式，但別把全部的錢都押上。','你有能力創造收入，善用手上的技能和資源。','財務決定先別急，多觀察，也相信你的直覺。','財運豐盛，可以適度享受，也記得留一些儲蓄。','照計畫理財，預算和紀律會帶來穩定。','跟著有經驗的人學理財，選擇穩健的方式。','面臨金錢上的選擇，選和你價值觀一致的那個。','積極爭取收入，靠努力有機會突破。','控制衝動消費，耐心會讓錢慢慢累積。','適合檢視自己的金錢觀，這陣子低調保守。','財運有轉機，留意突然出現的機會。','合約和帳目要清楚，付出和收入會相符。','收入暫時停滯，換個角度可能找到新財路。','某個收入來源結束，是重新規劃財務的時候。','收支平衡最重要，適度花費、穩定存錢。','小心欠債、分期付款和誘惑型消費。','可能有突發支出，先準備一筆緊急預備金。','財務慢慢恢復，長期目標有希望達成。','財務資訊不明，小心詐騙和看不懂的投資。','財運很好，努力會看到回報。','過去的投入開始回收，也適合重新檢視財務。','財務目標達成，可以規劃下一個階段。'];
const RANK_T={
1:['一段新的感情或新的心動正在開始。','新的工作機會或計畫正在萌芽。','新的收入機會出現了。'],
2:['兩個人在互相試探，也可能要在兩人之間做選擇。','需要在兩件事之間取得平衡，或做出選擇。','收支要平衡，眼前有兩個用錢的選擇。'],
3:['感情在擴展，也可能有朋友或第三方加入。','團隊合作會帶來進展。','透過合作或累積，收入慢慢增加。'],
4:['關係穩定下來，但要小心變得太安逸。','工作穩定，適合暫時守住目前的位置。','守住現有的錢，穩定為先。'],
5:['有摩擦或失落，需要好好溝通。','工作上有衝突或挫折。','可能有損失或額外支出。'],
6:['關係在修復，互相付出比較平衡。','得到協助或肯定，事情正在好轉。','有借貸往來，或得到別人的幫助。'],
7:['關係在考驗你的信任和耐心。','需要堅持，也要評估是否值得。','投資需要耐心，先別急著收成。'],
8:['感情進展很快，或你非常投入。','工作節奏快，進度正在推進。','努力工作帶來收入，靠技能賺錢。'],
9:['感情接近穩定，但心裡可能還有不安。','接近完成了，再撐一下。','財務接近目標，但也可能有些焦慮。'],
10:['感情走到一個階段的頂點，可能是圓滿，也可能是負擔太重。','任務告一段落，或工作量太重。','財務累積到一個程度，也要留意壓力。'],
11:['單純的好感，或一則新的消息。','學習新技能，或收到工作上的消息。','小額收入，或對理財有了新想法。'],
12:['有人積極追求，或你想主動出擊。','積極推進，或工作出現變動。','錢的進出變快，留意衝動消費。'],
13:['成熟、懂得照顧人的對象或態度。','有人在背後支持你，或你在照顧團隊。','懂得經營生活，財務穩健。'],
14:['穩重可靠的對象，或主導這段關係的人。','擔任領導角色，或遇到有權威的人。','財務掌控力強，適合做長期決定。']};
const REVHINT={love:'逆位表示這股感情能量卡住了，先把自己的感受說清楚。',work:'逆位表示這件事在工作上卡住了，先找出是哪個環節出問題。',money:'逆位提醒你財務上要特別保守，先別做大決定。'};
const MAJ_EL=['air','air','water','earth','fire','earth','air','water','fire','earth','fire','air','water','water','fire','earth','fire','air','water','fire','fire','earth'];
const SUIT_EL={w:'fire',c:'water',s:'air',p:'earth'};
const EL_NAME={fire:'火',water:'水',air:'風',earth:'土'};
const ACT={
fire:{general:['今天就挑一件拖很久的事，先做 10 分鐘。','把想做的事說出口，讓身邊的人知道。','安排一點運動，讓身體動起來。'],
 love:['主動約對方，提出一個具體的時間和地點。','把喜歡說出來，不要只等對方猜。','一起做一件新鮮的事，讓關係有點火花。'],
 work:['把點子寫成一頁提案，這週找機會提出來。','主動接一個你有興趣的任務。','設定一個兩週內能完成的小目標，衝一波。'],
 money:['想一個能用興趣或技能賺錢的方法，先試一次。','想買的東西先放購物車三天再決定。','為一個想完成的目標開一個專用的存錢帳戶。']},
water:{general:['寫下你現在真正的感受，不用整理。','找一個信任的朋友聊一聊。','給自己一個安靜的晚上，早點睡。'],
 love:['告訴對方你的感受，用「我覺得」開頭。','回想你們開心的時候，想想現在少了什麼。','先照顧好自己的情緒，再來處理關係。'],
 work:['問問自己：這份工作還讓你有熱情嗎？','跟同事多建立一點交情，請喝個飲料。','把讓你心累的事列出來，看哪件可以放下。'],
 money:['檢查一下最近是不是在用花錢紓壓。','把一筆錢花在真正讓你開心的事上。','跟家人或伴侶聊聊彼此的金錢觀。']},
air:{general:['把腦中的煩惱全部寫在紙上。','把一個猶豫很久的決定列出優缺點。','少滑一點手機，讓腦袋休息。'],
 love:['把想說的話先寫下來，再找時間好好談。','避免在情緒上頭時傳訊息。','有疑問就直接問清楚，不要自己猜。'],
 work:['把問題拆成小步驟，一次只解決一個。','重要的事用文字確認，留下紀錄。','找一位前輩請教，聽聽不同的看法。'],
 money:['比較三個選項再決定，不急著下單。','仔細看完合約和條款再簽。','列出每個月的固定支出，看哪一項可以砍。']},
earth:{general:['整理房間或桌面，讓生活回到秩序。','維持固定的作息一個禮拜。','把一個大目標拆成每天能做的小事。'],
 love:['用實際行動表達心意，例如陪伴或幫忙。','一起規劃一件具體的事，例如一趟小旅行。','看看你們的生活節奏和現實條件合不合得來。'],
 work:['把份內的事做扎實，細節會被看見。','花時間學一項實用的技能。','整理你的作品或成果，準備好隨時能拿出來。'],
 money:['開始記帳，至少記一個月。','每個月固定存下一筆錢，金額小也沒關係。','檢查保險、訂閱和各種固定支出。']}};

topicLine=function(c,rev,topic){
  if(topic==='general')return '';
  if(c.major){const base=topic==='love'?c.love:topic==='work'?c.work:MAJ_MONEY[c.i];return rev?`${base.replace(/。$/,'')}，但逆位時這股力量卡住了。${REVHINT[topic]}`:base}
  return RANK_T[c.rank][topic==='love'?0:topic==='work'?1:2]+SUIT[c.suit][topic]+'。'+(rev?REVHINT[topic]:'');
};
function dgKey(c){const d=BYID[c.id];return (c.rev?d.kr:d.k).slice(0,2).join('、')}
function dgP(c){const d=BYID[c.id];return `「${d.name}${c.rev?'（逆）':''}」的${dgKey(c)}`}
function dgFlow(a,b){const d=tone(b)-tone(a);return d>.6?'往好的方向走':d<-.6?'需要多留意的走向':'延續差不多的節奏'}
function dgStory(r){
  const c=r.cards,n=c.length,A=r.A||'選項A',B=r.B||'選項B',out=[];
  const lead=r.topic!=='general'?`放在${TOPICS[r.topic]}上來看，`:'';
  if(r.spread==='three')out.push(`${lead}過去的${dgP(c[0])}，一路帶你走到現在的${dgP(c[1])}。照目前的方向走下去，接下來會遇到${dgP(c[2])}，整體是${dgFlow(c[1],c[2])}。`);
  if(r.spread==='advice')out.push(`${lead}你現在處在${dgP(c[0])}。真正卡住你的，是${dgP(c[1])}。牌給你的方向是${dgP(c[2])}。`);
  if(r.spread==='relation'){const d=tone(c[0])-tone(c[2]);
    out.push(`${lead}你在這段關係裡帶著${dgP(c[0])}，對方則是${dgP(c[2])}。${Math.abs(d)<.6?'兩個人的狀態差不多，在同一個頻率上。':d>0?'你的狀態比較積極，對方可能還在觀望，或有自己的顧慮。':'對方的狀態比較積極，你可能還有些保留。'}`);
    out.push(`兩人之間現在是${dgP(c[1])}，要一起面對的課題是${dgP(c[3])}。照這樣下去，會走向${dgP(c[4])}。`)}
  if(r.spread==='choice')out.push(`${lead}你現在是${dgP(c[0])}。選「${A}」的話，過程會是${dgP(c[1])}，最後走到${dgP(c[2])}。選「${B}」的話，過程會是${dgP(c[3])}，最後走到${dgP(c[4])}。`);
  if(r.spread==='celtic'){
    out.push(`${lead}這件事的核心是${dgP(c[0])}，橫在面前的是${dgP(c[1])}。往下挖，問題的根源其實是${dgP(c[2])}；你心裡期望的是${dgP(c[4])}。`);
    out.push(`過去的${dgP(c[3])}正在離開，接下來不久會出現${dgP(c[5])}。你自己面對的姿態是${dgP(c[6])}，身邊的人和環境則帶來${dgP(c[7])}。你心裡同時期待也擔心的，是${dgP(c[8])}。把這些放在一起，最可能的結果是${dgP(c[9])}。`);
    if(tone(c[2])<0&&tone(c[9])>0)out.push('根源雖然不輕鬆，結果卻是好的，代表你正在把難題變成養分。');
    else if(tone(c[2])>0&&tone(c[9])<0)out.push('根基其實不差，結果卻有些吃力，問題可能出在做法，而不是你本身。');
  }
  if(r.spread==='three'||r.spread==='advice'){
    const SD={w:'行動和熱情',c:'感受和人際',s:'想法和溝通',p:'現實和金錢'};
    for(let i=0;i+1<n;i++){const a=c[i],b=c[i+1],da=BYID[a.id],db=BYID[b.id];
      if(a.rev&&!b.rev)out.push(`從「${da.name}」逆位接到「${db.name}」正位，代表卡住的事會慢慢鬆開。`);
      else if(!a.rev&&b.rev)out.push(`「${da.name}」正位接著「${db.name}」逆位，提醒你順的時候也別鬆懈。`);
      else if(!da.major&&!db.major&&da.suit===db.suit)out.push(`「${da.name}」和「${db.name}」都是${SUIT[da.suit].n}，這一段特別跟${SD[da.suit]}有關。`);
      else if(da.major&&db.major)out.push(`「${da.name}」和「${db.name}」兩張大牌相連，這裡是整件事的轉折點。`);
    }
  }
  return out;
}
function dgActions(r){
  const c=r.cards,n=c.length,t=r.topic;let key;
  if(n===1)key=c[0];
  else if(r.spread==='choice')key=tone(c[1])+tone(c[2])>=tone(c[3])+tone(c[4])?c[2]:c[4];
  else if(r.spread==='celtic')key=c[9];
  else key=c[n-1];
  const el=d=>d.major?MAJ_EL[d.i]:SUIT_EL[d.suit];
  const k=BYID[key.id],e1=el(k);
  const other=c.map(x=>el(BYID[x.id])).find(e=>e!==e1);
  const acts=[ACT[e1][t][0],ACT[e1][t][1],other?ACT[other][t][2]:ACT[e1][t][2]];
  if(n>1&&c.filter(x=>x.rev).length/n>=.5)acts[2]='先處理讓你最卡的那一件事，其他的可以晚一點再說。';
  return {el:e1,key:k,acts};
}
const _synthHTML=synthHTML;synthHTML=function(r){
  const h=_synthHTML(r),st=dgStory(r),a=dgActions(r);
  const extra=(st.length?`<h3 class="dg-h">牌和牌一起看</h3>${st.map(p=>`<p>${esc(p)}</p>`).join('')}`:'')+
    `<h3 class="dg-h">接下來可以這樣做</h3><p class="dg-sub">根據「${a.key.name}」的${EL_NAME[a.el]}元素${r.topic!=='general'?'和你問的'+TOPICS[r.topic]:''}</p><ul class="dg-acts">${a.acts.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`;
  return h.replace('<ul class="summary">',extra+'<ul class="summary">');
};
const _readingText=readingText;readingText=function(r){
  const t=_readingText(r),i=t.lastIndexOf('\n\n'),st=dgStory(r),a=dgActions(r);
  return t.slice(0,i)+(st.length?'\n\n牌和牌一起看：\n'+st.join('\n'):'')+'\n\n可以這樣做：\n'+a.acts.map(x=>'・'+x).join('\n')+t.slice(i);
};
function tarotCardSpec(r){const sp=SP[r.spread],n=r.cards.length,a=dgActions(r),d0=BYID[r.cards[0].id];
  return {eyebrow:'塔羅・'+sp.n,title:n===1?d0.name+(r.cards[0].rev?'（逆位）':''):'我抽到的牌',q:r.q,pig:'img/pig-card.webp',
    msgTitle:n===1?'這張牌想告訴你':'小豬建議你',msg:n===1?(r.cards[0].rev?d0.r:d0.u):a.acts[0],
    body:async(x,{top,W,T})=>{const cs=r.cards;
      if(n<=3){const cw=n===1?300:250,ch=cw*12/7,gap=40,tot=n*cw+(n-1)*gap,cy=top+ch/2+10;
        for(let i=0;i<n;i++){const c=cs[i],cx=(W-tot)/2+cw/2+i*(cw+gap);await dgDrawCardImg(x,'cards/'+c.id+'.webp',cx,cy,cw,ch,c.rev);
          x.textAlign='center';x.fillStyle=T.soft;x.font=`400 28px ${DG_F}`;x.fillText(lab(sp.pos[i][0],r).replace(/[「」]/g,''),cx,cy+ch/2+44);
          x.fillStyle=T.ink;x.font=`700 32px ${DG_F}`;x.fillText(BYID[c.id].name+(c.rev?'・逆':''),cx,cy+ch/2+86)}
      }else{const cw=150,ch=cw*12/7,gx=24;
        for(let i=0;i<n;i++){const c=cs[i],col=i%5,row=Math.floor(i/5),per=Math.min(5,n-row*5),off=(W-(per*cw+(per-1)*gx))/2;
          const cx=off+cw/2+col*(cw+gx),cy=top+ch/2+row*(ch+70);await dgDrawCardImg(x,'cards/'+c.id+'.webp',cx,cy,cw,ch,c.rev);
          x.textAlign='center';x.fillStyle=T.ink;x.font=`700 24px ${DG_F}`;x.fillText(BYID[c.id].name+(c.rev?'逆':''),cx,cy+ch/2+34)}}
      x.textAlign='left'}}}
document.addEventListener('click',e=>{if(e.target.closest('[data-act="imgcard"]')&&S.reading)dgShowCard(tarotCardSpec(S.reading),'問問小豬-塔羅')});
