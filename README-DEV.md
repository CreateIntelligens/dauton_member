# 大同會員系統 - 開發環境設定

## 🚨 CORS 問題說明

由於瀏覽器的安全限制，從本地開發環境（localhost）直接存取外部 API 會被 CORS 政策阻擋。

錯誤訊息：
```
Failed to fetch
Access to fetch at 'https://tatungssodev.azurewebsites.net/...'
from origin 'http://localhost:8000' has been blocked by CORS policy
```

## ✅ 解決方案：使用 CORS Proxy

我們提供了一個本地代理伺服器來繞過 CORS 限制。

## 🚀 快速啟動（自動化）

### 方法 1：使用啟動腳本（推薦）

```bash
cd /Users/danielyang/Documents/dauton_member
./start-dev.sh
```

這會自動啟動：
- ✅ CORS Proxy Server (Port 3000)
- ✅ 靜態檔案伺服器 (Port 8000)

然後開啟瀏覽器：
```
http://localhost:8000/index-dev.html
```

### 方法 2：手動啟動

#### 步驟 1：啟動 CORS Proxy

```bash
node proxy-server.js
```

#### 步驟 2：啟動靜態伺服器（另開一個終端機）

```bash
python3 -m http.server 8000
```

#### 步驟 3：開啟瀏覽器

```
http://localhost:8000/index-dev.html
```

## 📁 檔案說明

| 檔案 | 用途 |
|------|------|
| `index.html` | 正式版（直接連 API，會有 CORS 問題） |
| `index-dev.html` | 開發版（透過 Proxy，無 CORS 問題） |
| `proxy-server.js` | CORS 代理伺服器 |
| `start-dev.sh` | 一鍵啟動開發環境腳本 |
| `test-api.html` | API 測試工具 |

## 🔧 測試工具

開啟測試工具頁面：
```
http://localhost:8000/test-api.html
```

可以測試：
1. API 連線狀態
2. OAuth Token 取得
3. 發送驗證碼功能

## 📝 注意事項

1. **開發環境**：使用 `index-dev.html`（透過 Proxy）
2. **正式環境**：使用 `index.html`（需要後端設定 CORS）
3. **Proxy 只用於開發**：正式上線需要後端團隊設定 CORS 允許清單

## 🛑 停止伺服器

按 `Ctrl + C` 停止

## ❓ 常見問題

### Q: 為什麼需要 Proxy？
A: 瀏覽器的安全機制阻擋跨域請求，Proxy 可以繞過這個限制。

### Q: 正式環境怎麼辦？
A: 正式環境需要請後端團隊在 API 伺服器設定 CORS headers：
```
Access-Control-Allow-Origin: https://your-domain.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
```

### Q: 可以直接用瀏覽器關閉 CORS 嗎？
A: 可以，但不建議。僅測試用：
```bash
# Chrome (macOS)
open -na "Google Chrome" --args --disable-web-security --user-data-dir=/tmp/chrome_dev
```
