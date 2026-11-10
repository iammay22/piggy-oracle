
/* ---- 問問小豬: richer Lenormand reading ---- */
const LT=[null,
['有人主動靠近，或對方的消息很快就來。','新的機會或消息很快就到。','錢進來得快，去得也快。'],
['輕鬆的小曖昧，不用想得太重。','小機會出現了，抓住就好。','有一點小額的意外之財。'],
['遠距離，或關係正在變化。','出差、外派，或換跑道。','跟國外、遠方或貿易有關的收入。'],
['想穩定下來，家人的意見很重要。','工作環境穩定，適合守成。','房子或家用的開銷，也可能是資產。'],
['需要時間慢慢培養的長久關係。','要時間累積，急不來。','長期投資，讓錢慢慢長大。'],
['心意不明，彼此可能有誤會。','方向不清楚，資訊還不夠。','財務狀況不明朗，先別投資。'],
['有複雜的狀況，或有人在動心機。','小心辦公室政治和算計。','要繞點路才拿得到錢，留意合約細節。'],
['一段關係走到尾聲，或需要冷卻一下。','計畫結束或你很倦怠，需要休息。','一筆支出，或某個收入來源中斷。'],
['被欣賞，或收到驚喜。','受到肯定或好評。','禮金、獎金，或一點小確幸。'],
['突然的決定，或突然斷開。','快刀斬亂麻，或遇到突發狀況。','突然的支出，小心衝動消費。'],
['反覆爭吵，也可能是強烈的吸引。','重複的勞動，或爭論很多。','為了錢爭執，來回拉扯。'],
['常聊天、傳訊息，也可能為小事緊張。','開會、談判或電話很多。','談價錢、討論預算。'],
['新的開始，關係還很單純。','新手階段，或新的專案。','小額收入，從小處開始累積。'],
['對方可能有所保留，多觀察一下。','要精明一點，保護自己的權益。','精打細算，提防被騙。'],
['保護欲強的對象，或家長的影響。','主管或權威人物是關鍵，也提醒你該展現實力。','存款和資金充足。'],
['理想的對象，彼此有共同的願景。','方向清楚，適合規劃目標。','財運方向不錯，也可能和網路有關。'],
['關係往前一步，例如同居或改變相處方式。','職務調動或升遷。','財務狀況正在改善。'],
['忠誠的伴侶，或從朋友變成戀人。','可靠的同事或合作夥伴。','朋友幫忙或介紹的財路。'],
['保持距離，或在關係裡覺得孤單。','大公司、公家機關，或公事公辦。','銀行、制度內的收入。'],
['在社交場合認識人，或關係公開了。','人脈、活動和曝光。','靠群眾或社群帶來收入。'],
['有阻礙或冷淡期，需要耐心。','進度卡住，遇到難關。','資金延遲，錢卡住了。'],
['面臨選擇，或還有其他可能。','要選方向，眼前有兩個以上的機會。','有多種收入管道，要做取捨。'],
['不安和猜疑正在消耗感情。','壓力大，資源被消耗。','小錢一直流失，記得記帳。'],
['真心相愛，感情升溫。','做喜歡的事，團隊有溫度。','錢花在喜歡的事上，或靠熱情賺錢。'],
['承諾、穩定交往，或婚約。','簽約，或長期合作。','合約收入或定期收入。'],
['還有你不知道的事，或關係正在保密。','學習、研究或考試。','還有沒看到的資訊，先研究再出手。'],
['收到訊息或告白。','文件、email 或正式通知。','帳單、發票或收據。'],
['重點在你自己，或某位男性的想法。','某位男性同事或主管是關鍵。','你自己的理財決定是關鍵。'],
['重點在你自己，或某位女性的想法。','某位女性同事或主管是關鍵。','你自己的理財決定是關鍵。'],
['成熟平靜的關係，或年紀較長的對象。','經驗豐富，步調穩定。','穩健保守，不求快。'],
['關係順利，公開又快樂。','成功，被看見。','財運旺，努力有回報。'],
['浪漫，情緒起伏比較大。','創意和名聲，努力被認可。','靠創意或名氣賺錢，收入會有起伏。'],
['關係找到解答，可以把話說開。','找到突破口，問題能解決。','財務問題有解，關鍵就在眼前。'],
['自由、流動的關係，或常花錢約會。','生意、業務或自由接案。','錢在流動，有賺也有花。'],
['長久穩定的關係。','穩定的工作，可以持續下去。','穩定的收入，適合長期規劃。'],
['感情有負擔，或正在接受考驗。','責任重，壓力大。','必要的開銷，或有債務要處理。']];
const LA={
general:['趁順的時候，把想做的事排進這週的行程。','先列出你能控制的三件事，從最小的一件開始。','這陣子先別急著做大決定，給自己一週觀察期。'],
love:['主動傳一則訊息，說出你一直想說的話。','約對方好好聊一次，問問他現在的想法。','先把心思放回自己身上，安排一件讓你開心的事。'],
work:['把你的想法整理成一頁，找機會提出來。','把手上的事排好優先順序，先完成最重要的一件。','先別急著換跑道，把現在的狀況寫下來再評估。'],
money:['可以把一筆錢放進存款或長期計畫。','這個月認真記帳，看清楚錢花去哪裡。','先暫停大筆消費和投資，保留一些現金。']};
const COMBO=[['心','戒指','感情走向承諾，關係會更穩定。'],['騎士','信','很快會收到重要的訊息。'],['鑰匙','太陽','一定能成功，答案很明朗。'],['棺材','小孩','一件事結束後，會有新的開始。'],['狐狸','熊','跟主管或有權力的人有關，要聰明應對。'],['魚','錨','收入穩定，財務站得住。'],['雲','太陽','迷霧會散去，事情很快就明朗。'],['山','鑰匙','卡住的事找到突破口了。'],['老鼠','魚','錢在一點一點流失，要記帳。'],['鳥','心','會聊到感情，可以把心裡話說出來。'],['船','房子','搬家，或換一個環境。'],['鸛鳥','房子','搬家，或家裡有新的變化。'],['書','信','跟秘密、文件或考試有關的消息。'],['蛇','心','感情裡有複雜的狀況，或有第三者。'],['鐮刀','心','感情可能突然斷開，或心被傷到。'],['樹','棺材','身體需要休息，別硬撐。'],['星星','鑰匙','願望有實現的方法。'],['狗','花園','朋友聚會或社交圈帶來好運。'],['戒指','鞭子','合約或承諾有爭議，反覆拉扯。'],['花束','女士','會收到一份心意或讚美。'],['花束','男士','會收到一份心意或讚美。'],['塔','十字架','在體制裡扛著沉重的責任。'],['錨','十字架','長期的責任，需要撐下去。'],['幸運草','魚','有一點意外之財。'],['十字路口','船','要選擇往哪裡去，可能是換工作或出遠門。'],['月亮','花園','名氣上升，被很多人看見。'],['熊','魚','資金充足，財務實力強。'],['老鼠','心','不安在消耗感情，先處理心裡的擔心。'],['太陽','戒指','成功的合作，或快樂的承諾。'],['百合','房子','家裡平靜和諧。'],['雲','心','感情裡有看不清的地方，先別下結論。'],['山','心','感情遇到阻礙，需要耐心。'],['騎士','心','有人帶著好感靠近。'],['狐狸','魚','跟錢有關的事要多留心眼。'],['十字路口','心','在感情裡面臨選擇。']];
const TN={general:'整體',love:'感情',work:'工作',money:'財運'};
let dgTopic='general';
function dgSetTopic(t){if(!TN[t])t='general';dgTopic=t;document.querySelectorAll('.dg-topics button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.t===t))}
function dgCombo(x,y){const m=COMBO.find(p=>(p[0]===x.name&&p[1]===y.name)||(p[0]===y.name&&p[1]===x.name));return m?`「${x.name}＋${y.name}」：${m[2]}`:''}
function dgLenoExtra(){
  const t=dgTopic,ti={love:0,work:1,money:2}[t];let h='';
  if(mode===3){const [a,b,c]=picked;
    if(t!=='general')h+=`<h3 class="dg-h">放到${TN[t]}上來看</h3><p>重點在「${b.name}」：${LT[b.n][ti]}</p><p>左邊的「${a.name}」補充：${LT[a.n][ti]}</p><p>右邊的「${c.name}」則說：${LT[c.n][ti]}</p>`;
    const cm=[dgCombo(a,b),dgCombo(b,c),dgCombo(a,c)].filter(Boolean);
    if(cm.length)h+=`<h3 class="dg-h">經典組合</h3>`+cm.map(x=>`<p>${x}</p>`).join('');
  }else{const c=picked[0];if(t!=='general')h+=`<h3 class="dg-h">放到${TN[t]}上來看</h3><p>${LT[c.n][ti]}</p>`}
  const lean=leanOf(picked),L=(lean==='是'||lean==='偏是')?0:lean==='看情況'?1:2;
  const acts=[...new Set([(mode===3?picked[1]:picked[0]).tip,LA[t][L],mode===3?picked[2].tip:null].filter(Boolean))];
  h+=`<h3 class="dg-h">接下來可以這樣做</h3><ul class="dg-acts">${acts.map(x=>`<li>${x}</li>`).join('')}</ul>`;
  return h;
}
const _showReadingX=showReading;showReading=function(){_showReadingX();if(picked.length<mode)return;
  const r=$("reading"),hint=r.querySelector('.hint');if(hint)hint.insertAdjacentHTML('beforebegin','<div class="dg-extra">'+dgLenoExtra()+'</div>')};
document.addEventListener('click',e=>{const b=e.target.closest('.dg-topics button');if(!b)return;dgSetTopic(b.dataset.t);dgT('lenormand/topic/'+b.dataset.t);
  if(picked.length===mode&&!$("reading").hidden){const x=$("reading").querySelector('.dg-extra');if(x)x.innerHTML=dgLenoExtra()}});
function lenoCardSpec(){const cs=picked;let msg=mode===3?`這件事的核心是「${cs[1].noun}」。它${cs[0].adj}，也${cs[2].adj}。`:cs[0].tip;
  return {eyebrow:'雷諾曼'+(dgTopic!=='general'?'・'+TN[dgTopic]:''),title:mode===3?'三張牌連成一句話':'今日提醒',q:$("question").value.trim(),pig:'img/pig-crystal.webp',msgTitle:'整體傾向：'+leanOf(cs),msg,
    body:async(x,{top,W,T})=>{const n=cs.length,cw=n===1?280:240,ch=cw*1.48,gap=40,tot=n*cw+(n-1)*gap,labels=n===3?['左・形容','核心','右・形容']:['今日提醒'];
      for(let i=0;i<n;i++){const c=cs[i],cx=(W-tot)/2+cw/2+i*(cw+gap),y=top+20;
        x.save();x.shadowColor='rgba(0,0,0,.15)';x.shadowBlur=16;x.shadowOffsetY=6;x.fillStyle='#f3ead6';dgRR(x,cx-cw/2,y,cw,ch,16);x.fill();x.restore();
        x.strokeStyle='#8a6a3a';x.lineWidth=3;dgRR(x,cx-cw/2+10,y+10,cw-20,ch-20,10);x.stroke();
        x.fillStyle='#2b2420';x.font=`700 30px ${DG_F}`;x.textAlign='left';x.fillText(String(c.n),cx-cw/2+26,y+54);
        x.fillStyle='#fff';dgRR(x,cx-34,y+30,68,88,6);x.fill();x.strokeStyle='#2b2420';x.lineWidth=2;x.stroke();
        x.fillStyle=/[♥♦]/.test(c.pip)?'#b0302c':'#1c1c1c';x.textAlign='center';x.font='700 30px Georgia,serif';x.fillText(c.pip,cx,y+86);
        x.fillStyle='#2b2420';x.font=`700 ${c.name.length>3?44:54}px ${DG_F}`;x.fillText(c.name,cx,y+ch*.62);
        x.fillStyle='#6b5a44';x.font=`400 24px ${DG_F}`;dgWrap(x,c.k,cx,y+ch*.62+48,cw-40,32,2);
        x.fillStyle=T.soft;x.font=`400 28px ${DG_F}`;x.fillText(labels[i],cx,y+ch+44)}
      x.textAlign='left'}}}
document.addEventListener('click',e=>{if(e.target.closest('#cardBtn')&&picked.length===mode)dgShowCard(lenoCardSpec(),'問問小豬-雷諾曼')});
