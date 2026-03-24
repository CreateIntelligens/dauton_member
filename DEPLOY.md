# 部署指南

## 📦 打包

```bash
# 方式 1: 使用腳本
sh build.sh

# 方式 2: 使用 npm
npm run build
```

---

## 📊 打包優化

**壓縮效果:**
- CSS: 12K → 8K (壓縮 33%)
- JS: 80K → 64K (壓縮 20%)
- 總計: 304K → 284K

**優化項目:**
- ✅ JavaScript 壓縮 (uglify-js)
- ✅ CSS 壓縮 (csso)
- ✅ 移除註解和空白
- ✅ 變數名稱混淆

---

## 🚀 部署步驟

### 1. 執行打包

```bash
sh build.sh
```

### 2. 測試打包結果

```bash
cd dist
python3 -m http.server 8002
```

開啟瀏覽器測試: `http://localhost:8002/?line_user_id=U123456`

### 3. 上傳到伺服器

將 `dist/` 目錄下的所有檔案上傳到你的 Web 伺服器。

**部署檔案清單:**
```
dist/
├── index.html          # 主頁面
├── css/
│   └── style.css       # 壓縮後的 CSS
├── js/
│   ├── api.js          # 壓縮後的 API 模組
│   ├── router.js       # 壓縮後的路由
│   ├── app.js          # 壓縮後的主程式
│   └── pages/          # 壓縮後的頁面模組
│       ├── terms.js
│       ├── login.js
│       ├── verify.js
│       ├── loginPassword.js
│       ├── privacy.js
│       ├── register.js
│       ├── bindCard.js
│       ├── agreement.js
│       ├── success.js
│       └── forgotPassword.js
└── assets/
    ├── tatung-logo.png
    └── header-bg.png
```

---

## ⚙️ 環境配置

### 修改 API 端點 (index.html)

部署前請確認以下設定:

```javascript
window.API_CONFIG = {
  // 大同 SSO API (生產環境)
  BASE_URL: 'https://tatungssodev.azurewebsites.net',

  // 你們的後端系統 (生產環境)
  BACKEND_LOGIN_URL: 'https://line.tatung2025.aitago.tw', // ⚠️ 改為生產環境

  CLIENT_ID: 'aicreate360',
  CLIENT_SECRET: '3Fstg56cAe59f8?xDT9Hb81Kp567E78Ae',

  // ... 其他設定
};
```

**重要提醒:**
- ⚠️ `BACKEND_LOGIN_URL` 要改為生產環境 URL
- ⚠️ 確認 `CLIENT_ID` 和 `CLIENT_SECRET` 是否正確
- ⚠️ 這些資訊會暴露在前端,建議由後端代理處理

---

## 🌐 Nginx 配置範例

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /var/www/dauton-member/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 快取靜態資源
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

---

## 🔍 部署檢查清單

- [ ] 執行 `sh build.sh` 打包
- [ ] 測試打包結果 `cd dist && python3 -m http.server 8002`
- [ ] 確認 URL 參數 `?line_user_id=xxx` 正常運作
- [ ] 確認所有流程可正常運行:
  - [ ] 已連結帳號登入
  - [ ] 新會員註冊
  - [ ] 綁定既有會員卡
- [ ] 修改 `BACKEND_LOGIN_URL` 為生產環境
- [ ] 上傳 `dist/` 到伺服器
- [ ] 在生產環境測試完整流程
- [ ] 檢查 Console 是否有錯誤

---

## 📱 LINE LIFF 整合

如果要整合 LINE LIFF,在 `index.html` 中加入:

```html
<script src="https://static.line-scdn.net/liff/edge/2/sdk.js"></script>
<script>
  // 初始化 LIFF
  liff.init({ liffId: 'YOUR-LIFF-ID' })
    .then(() => {
      // 取得 LINE User ID
      if (liff.isLoggedIn()) {
        const profile = liff.getProfile();
        const lineUserId = profile.userId;

        // 更新 Router state
        Router.state.lineUserId = lineUserId;
      }
    });
</script>
```

---

## 🐛 除錯

### 檢查打包後的 JS 是否有錯誤

```bash
# 檢查壓縮後的 JS 語法
node -c dist/js/api.js
node -c dist/js/router.js
node -c dist/js/app.js
```

### 查看壓縮前後對比

```bash
# 原始檔案
wc -l js/api.js

# 壓縮後
wc -l dist/js/api.js
```

---

## 📞 常見問題

### Q: 打包後無法運行?
A: 檢查 Console 是否有錯誤,可能是壓縮過度導致語法錯誤

### Q: 圖片無法顯示?
A: 確認 `assets/` 目錄是否正確複製到 `dist/assets/`

### Q: API 無法連線?
A: 檢查 `BACKEND_LOGIN_URL` 是否設定正確,CORS 是否設定正確

---

## 🔐 安全性建議

1. **不要在前端儲存 CLIENT_SECRET**
   - 建議由後端 API 代理處理
   - 前端只呼叫後端 API

2. **使用 HTTPS**
   - 生產環境必須使用 HTTPS
   - 保護使用者資料傳輸安全

3. **設定 CSP (Content Security Policy)**
   - 防止 XSS 攻擊
   - 限制可載入的資源來源

---

完成! 🎉
