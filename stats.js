/* 問問地瓜鳥 — anonymous counts sent to your Google Sheet. Leave SHEET_URL empty to turn counting off. */
(function(){
  var SHEET_URL = 'https://script.google.com/macros/s/AKfycby9ttp7TF-O737paN7B2NaDgkqhsxId6si77ijs9C0zC2DjxQi7VHZiqiKFn4Qxu5XL/exec';
  var q = [], t;
  function page(){ return (location.pathname.split('/').pop() || 'index').replace('.html','') || 'index'; }
  function flush(){
    if(!q.length) return;
    var body = JSON.stringify(q); q = [];
    try{ fetch(SHEET_URL, {method:'POST', mode:'no-cors', keepalive:true, headers:{'Content-Type':'text/plain;charset=utf-8'}, body:body}).catch(function(){}); }catch(e){}
  }
  window.dgTrack = function(path){
    if(!SHEET_URL) return;
    var a = String(path).split('/');
    q.push({p:a[0], e:a[1]||'', d:a.slice(2).join('/')});
    clearTimeout(t); t = setTimeout(flush, 800);
  };
  if(!SHEET_URL) return;
  var from = '';
  if(location.search) from = 'share';
  else if(document.referrer){ try{ var h = new URL(document.referrer).hostname; from = h === location.hostname ? 'inside' : h; }catch(e){} }
  window.dgTrack(page() + '/view/' + from);
  addEventListener('pagehide', flush);
})();
