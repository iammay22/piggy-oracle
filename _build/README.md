# 建置原始檔（給之後的對話用）

網站根目錄的 html 是由 `build.py` 產生的，要改網站請改這裡的原始檔，再重新建置。

## 還原工作資料夾
```
mkdir -p /home/claude/digua-site && cd /home/claude/digua-site
cp -r <repo>/_build/* .
cp -r <repo>/img <repo>/audio <repo>/fonts <repo>/cards <repo>/og-image.jpg <repo>/theme.css <repo>/stats.js .   # 圖片、字型等素材從網站根目錄拿
```
- `build.py` 第 2 行是工作資料夾、第 5 行 `SCR` 是暫存資料夾，換對話後改成新路徑。
- 字型子集化需要完整的源泉圓體 OTF（github.com/ButTaiwan/gensen-font），放在 `SCR/fontsrc/g/otf/TW/`；還要 `pip install brotli`（輸出 woff2 用）。
- build.py 直接輸出在工作資料夾裡（不是 site/），首頁 index.html 不要用建置出來的。

## 建置
```
python3 build.py https://iammay22.github.io/piggy-oracle "https://script.google.com/macros/s/AKfycby9ttp7TF-O737paN7B2NaDgkqhsxId6si77ijs9C0zC2DjxQi7VHZiqiKFn4Qxu5XL/exec"
```
輸出在 `site/`，把內容複製到 repo 根目錄（保留 `.git` 和 `_build/`）再 push。

## 檔案
- `src-tarot.html`、`src-iching.html`、`src-leno.html`：may22 原本的三個占卜（不要直接改，build 會注入共用樣式）
- `hub.html`：首頁；`qian-body.html`：擲筊求籤；`numerology-body.html`：生命靈數（頁面自帶圖卡和分享程式，build 只加導覽列、寶寶藍房間配色和頁尾）
- `sound.js`：背景音樂和音效（右下角聲音按鈕），素材在網站根目錄 `audio/`，來源和授權見 `audio/CREDITS.txt`
- `ext-*.js`：加強解讀、圖鑑、紀錄、圖卡等共用功能
- `ext-poster.js`：分享圖卡的共用版面（漸層背景、拱門、星星、半透明解讀框、字多自動縮小），塔羅、易經、雷諾曼、求籤由 build 接在 ext-card.js 後面；生命靈數在 `numerology-body.html` 的 `/*POSTER_JS*/` 位置注入。各頁的圖卡：`tarotFull`、`ichingFull`、`lenoFull`、`qFullCard`、`numSoloFull`／`numGridFull`／`numPairFull`
- `小豬統計-AppsScript.gs`：試算表統計程式（貼在 Google 試算表的 Apps Script）
