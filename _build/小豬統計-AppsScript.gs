/**
 * 問問小豬 — 匿名統計（中文、固定順序、自動長欄位）
 *
 * 更新方式：
 * 1. 打開試算表 → 擴充功能 → Apps Script
 * 2. 把原本的程式碼全部換成這一份，按「儲存」
 * 3. 上方函式選單選 setup → 按「執行」，跳出授權就按允許
 *    （會建立「每 30 分鐘自動更新統計」的排程，並馬上更新一次；「紀錄」裡的資料不會動）
 * 4. 到「部署 → 管理部署作業」→ 編輯（鉛筆）→ 版本選「新版本」→ 部署
 *    （網址不會變，網站不用改）
 *
 * 之後打開試算表，上方會多一個「小豬統計」選單，可以按「立即更新」。
 * 網站新增占卜頁或新功能時，總覽和每日瀏覽會自動多出新的列和欄，排在下面這份順序的後面。
 */

const LOG = '紀錄';

// 頁面順序與中文名稱（照這個順序排；沒列到的新頁面會自動加在最後）
const PAGES = [
  ['tarot', '塔羅'],
  ['iching', '易經'],
  ['lenormand', '雷諾曼'],
  ['qian', '求籤'],
  ['numerology', '生命靈數'],
  ['index', '首頁'],
  ['hub', '首頁'],
];

// 事件順序與中文名稱
const EVENTS = [
  ['view', '瀏覽'],
  ['done', '完成占卜'],
  ['share', '分享連結'],
  ['imgcard', '做成圖卡'],
  ['opened-share', '從分享連結進來'],
  ['asked', '問的方面'],
  ['card', '抽到的牌'],
  ['hex', '起到的卦'],
  ['method', '起卦方式'],
  ['jiao', '擲筊'],
  ['topic', '切換方面'],
  ['go', '首頁點選'],
  ['poke', '戳小豬'],
];

// 內容欄的英文代號換成中文
const DETAILS = {
  three: '時間之流', one: '一張指引', advice: '現況與建議', choice: '二選一', relation: '關係牌陣', celtic: '凱爾特十字',
  coin: '擲銅錢', name: '姓名起卦', num: '數字起卦',
  general: '整體', love: '感情', work: '工作', money: '財運',
  tarot: '塔羅', iching: '易經', lenormand: '雷諾曼', qian: '求籤', random: '讓小豬選', numerology: '生命靈數',
};

function zhName(list, key) {
  const f = list.find(function (x) { return x[0] === key || x[1] === key; });
  return f ? f[1] : key;
}
function sortByList(list, names) {
  const ordered = [];
  list.forEach(function (x) { if (names.has(x[1]) && ordered.indexOf(x[1]) < 0) ordered.push(x[1]); });
  const rest = Array.from(names).filter(function (n) { return ordered.indexOf(n) < 0; }).sort();
  return ordered.concat(rest);
}
/** 把每一列整理成中文頁面、中文事件（舊的英文紀錄也會換成中文） */
function normalize(r) {
  const p = zhName(PAGES, String(r[1] || ''));
  let e = String(r[2] || '');
  const d = String(r[3] || '');
  if (e === 'card' && !d) e = 'imgcard'; // 舊版圖卡紀錄
  if (p === '首頁' && (e === 'tarot' || e === 'iching' || e === 'lenormand' || e === 'random')) return [r[0], p, '首頁點選', DETAILS[e] || e];
  return [r[0], p, zhName(EVENTS, e), DETAILS[d] || d];
}

function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const log = ss.getSheetByName(LOG) || ss.insertSheet(LOG);
  log.getRange(1, 1, 1, 4).setValues([['時間', '頁面', '事件', '內容']]);
  log.setFrozenRows(1);
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'refresh') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('refresh').timeBased().everyMinutes(30).create();
  refresh();
}

function onOpen() {
  SpreadsheetApp.getUi().createMenu('小豬統計').addItem('立即更新', 'refresh').addToUi();
}

function refresh() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const log = ss.getSheetByName(LOG);
  const n = log ? log.getLastRow() : 0;
  const rows = n >= 2 ? log.getRange(2, 1, n - 1, 4).getValues().map(normalize).filter(function (r) { return r[1] && r[2]; }) : [];
  const tz = ss.getSpreadsheetTimeZone();

  // 總覽：每個頁面一列，每種事件一欄
  const pages = new Set(), events = new Set(), cnt = {};
  rows.forEach(function (r) { pages.add(r[1]); events.add(r[2]); const k = r[1] + '|' + r[2]; cnt[k] = (cnt[k] || 0) + 1; });
  const P = sortByList(PAGES, pages), E = sortByList(EVENTS, events);
  const sum = [['頁面'].concat(E)].concat(P.map(function (p) {
    return [p].concat(E.map(function (e) { return cnt[p + '|' + e] || ''; }));
  }));
  write(ss, '總覽', sum, 0);
  ss.getSheetByName('總覽').getRange('A1').setNote('最後更新：' + Utilities.formatDate(new Date(), tz, 'yyyy/MM/dd HH:mm'));

  // 每日瀏覽：每天一列，每個頁面一欄，最後是合計
  const day = {}, vpages = new Set();
  rows.forEach(function (r) {
    if (r[2] !== '瀏覽') return;
    const d = Utilities.formatDate(new Date(r[0]), tz, 'yyyy/MM/dd');
    day[d] = day[d] || {}; day[d][r[1]] = (day[d][r[1]] || 0) + 1; vpages.add(r[1]);
  });
  const VP = sortByList(PAGES, vpages);
  const days = Object.keys(day).sort().reverse();
  const daily = [['日期'].concat(VP).concat(['合計'])].concat(days.map(function (d) {
    const v = VP.map(function (p) { return day[d][p] || 0; });
    return [d].concat(v.map(function (x) { return x || ''; })).concat([v.reduce(function (a, b) { return a + b; }, 0)]);
  }));
  write(ss, '每日瀏覽', daily, 1);

  // 排行：最常出現的牌、卦、籤（依頁面順序，再依次數）
  const rk = {};
  rows.forEach(function (r) { if (!r[3] || r[2] === '瀏覽') return; const k = r[1] + '|' + r[2] + '|' + r[3]; rk[k] = (rk[k] || 0) + 1; });
  const pageIdx = function (p) { const i = P.indexOf(p); return i < 0 ? 99 : i; };
  const rank = [['頁面', '項目', '內容', '次數']].concat(Object.keys(rk).map(function (k) {
    const a = k.split('|'); return [a[0], a[1], a[2], rk[k]];
  }).sort(function (a, b) { return pageIdx(a[0]) - pageIdx(b[0]) || b[3] - a[3]; }).slice(0, 500));
  write(ss, '排行', rank, 2);
}

function write(ss, name, data, index) {
  let sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name, index);
  sh.clear();
  if (data.length === 1) data.push(data[0].map(function () { return ''; }));
  sh.getRange(1, 1, data.length, data[0].length).setValues(data);
  sh.setFrozenRows(1);
  sh.getRange(1, 1, 1, data[0].length).setFontWeight('bold');
}

function doPost(e) {
  try {
    const rows = JSON.parse(e.postData.contents);
    const list = (Array.isArray(rows) ? rows : [rows]).slice(0, 30);
    const now = new Date();
    const data = list.map(function (r) {
      return normalize([now, String(r.p || '').slice(0, 40), String(r.e || '').slice(0, 40), String(r.d || '').slice(0, 80)]);
    });
    if (data.length) {
      const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(LOG);
      sh.getRange(sh.getLastRow() + 1, 1, data.length, 4).setValues(data);
    }
  } catch (err) {}
  return ContentService.createTextOutput('ok');
}
