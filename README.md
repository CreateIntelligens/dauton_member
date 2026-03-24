# 大同會員系統 - LINE 個人化服務升級

大同會員系統前端專案,用於 LINE LIFF 環境,提供會員註冊、登入、綁定會員卡等功能。

## 🚀 功能特色

- ✅ 已註冊用戶密碼登入
- ✅ 新會員註冊
- ✅ 綁定現有會員卡
- ✅ 忘記密碼重設
- ✅ 手機號碼驗證
- ✅ LINE 帳號綁定

## 📋 技術架構

- 純 HTML/CSS/JavaScript (無框架)
- SPA 路由系統
- OAuth 2.0 認證
- CORS Proxy 開發環境支援

## 🛠️ 安裝與使用

### 開發環境

```bash
# 安裝依賴
npm install

# 啟動 CORS Proxy (開發用)
node proxy-server.js

# 啟動開發服務器 (另一個終端)
npm run dev
```

訪問: http://localhost:8080/

### 生產環境打包

```bash
# 打包
npm run build

# 預覽打包結果
npm run preview
```

## 📁 專案結構

```
dauton_member/
├── js/
│   ├── api.js           # API 服務模組
│   ├── router.js        # SPA 路由系統
│   ├── app.js          # 應用初始化
│   └── pages/          # 各頁面邏輯
│       ├── login.js
│       ├── verify.js
│       ├── register.js
│       ├── bindCard.js
│       └── ...
├── css/
│   └── style.css       # 全局樣式
├── assets/
│   └── tatung-logo.png
├── index.html          # 主頁面
├── proxy-server.js     # CORS 代理伺服器 (開發用)
├── build.sh           # 打包腳本
└── API_FLOW_DOCUMENT.md  # API 流程文件

## 📖 API 文件

詳細的 API 流程與規格請參考: [API_FLOW_DOCUMENT.md](./API_FLOW_DOCUMENT.md)

## 🔧 設定說明

### API 端點設定

在 `index.html` 中設定 API 端點:

```javascript
window.API_CONFIG = {
  BASE_URL: 'https://tatungssodev.azurewebsites.net',
  CLIENT_ID: 'aicreate360',
  CLIENT_SECRET: '3Fstg56cAe59f8?xDT9Hb81Kp567E78Ae',
  BACKEND_LOGIN_URL: 'https://line.uat.tatung2025.aitago.tw',
  // ...
};
```

### CORS 問題解決

開發環境使用 `proxy-server.js` 繞過 CORS 限制:

```bash
node proxy-server.js
```

生產環境需要後端 API 設定 CORS Headers。

## 📞 聯絡資訊

- 客服專線: (02) 2591-5068
- 服務時間: 週一～週六 9:00～18:00 (國定例假日除外)

## 📝 授權

© 2016 Tatung Co. All rights reserved.
