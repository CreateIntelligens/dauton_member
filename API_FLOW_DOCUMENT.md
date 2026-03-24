# 大同會員系統 - 完整流程與 API 文件

## 📋 目錄
1. [已註冊用戶登入流程](#1-已註冊用戶登入流程)
2. [未註冊用戶 - 新會員註冊流程](#2-未註冊用戶---新會員註冊流程)
3. [未註冊用戶 - 綁定現有會員卡流程](#3-未註冊用戶---綁定現有會員卡流程)
4. [忘記密碼流程](#4-忘記密碼流程)
5. [後端接收資料規格](#5-後端接收資料規格)

---

## 1. 已註冊用戶登入流程

### 流程圖
```
┌─────────────────────────────────────────────────────────────────┐
│ STEP 1: 輸入手機號碼                                              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ API: POST /service/account/checkUsernameUsed                    │
│ Request Body: {                                                  │
│   username: "0912345678",                                        │
│   clientId: "aicreate360",                                       │
│   clientSecret: "3Fstg56cAe59f8?xDT9Hb81Kp567E78Ae"            │
│ }                                                                │
│                                                                  │
│ Response: {                                                      │
│   code: "0",                                                     │
│   data: {                                                        │
│     isLinked: true,  ← 已註冊                                   │
│     usernameType: "MOBILE",                                      │
│     existMembers: []                                             │
│   }                                                              │
│ }                                                                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    判斷: isLinked = true
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 2: 導向密碼登入頁面                                          │
│ 輸入密碼                                                         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ API: POST /newgateway/oauth/token                               │
│ Content-Type: application/x-www-form-urlencoded                 │
│ Request Body:                                                    │
│   grant_type=password                                            │
│   client_id=aicreate360                                          │
│   client_secret=3Fstg56cAe59f8?xDT9Hb81Kp567E78Ae               │
│   username=0912345678                                            │
│   password=使用者輸入的密碼                                       │
│                                                                  │
│ Response: {                                                      │
│   access_token: "eyJhbGc...",                                    │
│   token_type: "bearer",                                          │
│   expires_in: 863999,                                            │
│   refresh_token: "e3001628..."                                   │
│ }                                                                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 🔄 發送登入資訊給後端系統 (LINE 綁定用)                           │
│                                                                  │
│ API: POST {BACKEND_LOGIN_URL}/api/gateway/login/{lineUserId}    │
│ 例如: POST https://line.uat.tatung2025.aitago.tw/api/gateway/   │
│       login/U1234567890abcdef                                    │
│                                                                  │
│ Request Headers:                                                 │
│   Accept: application/json                                       │
│   Content-Type: application/json                                 │
│                                                                  │
│ Request Body: {                                                  │
│   username: "0912345678",                                        │
│   password: "使用者密碼",                                         │
│   accessToken: "eyJhbGc..."  ← OAuth access_token               │
│ }                                                                │
│                                                                  │
│ ⚠️ 說明:                                                         │
│ - lineUserId: 從 LINE LIFF 初始化時取得的用戶 ID                 │
│ - 此 API 用於將大同會員帳號與 LINE 帳號綁定                       │
│ - 後端應儲存此關聯,供 LINE Bot 使用                               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 3: 檢查會員條款版本 (可選)                                   │
│                                                                  │
│ API: GET /service/member/getagreementv                           │
│ Headers:                                                         │
│   Authorization: bearer {access_token}                           │
│                                                                  │
│ Response: "NEWPUBLISHV" 或其他版本                               │
│                                                                  │
│ 若回傳 "NEWPUBLISHV" → 導向同意條款頁面                          │
│ 否則 → 直接進入成功頁面                                          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 4: 登入完成頁面                                              │
│ - 顯示「登入完成」                                                │
│ - 按鈕「關閉視窗」(呼叫 liff.closeWindow())                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. 未註冊用戶 - 新會員註冊流程

### 流程圖
```
┌─────────────────────────────────────────────────────────────────┐
│ STEP 1: 輸入手機號碼                                              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ API: POST /service/account/checkUsernameUsed                    │
│ Request Body: {                                                  │
│   username: "0900000001",                                        │
│   clientId: "aicreate360",                                       │
│   clientSecret: "3Fstg56cAe59f8?xDT9Hb81Kp567E78Ae"            │
│ }                                                                │
│                                                                  │
│ Response: {                                                      │
│   code: "0",                                                     │
│   data: {                                                        │
│     isLinked: false,  ← 未註冊                                  │
│     usernameType: "MOBILE",                                      │
│     existMembers: []  ← 無現有會員卡                            │
│   }                                                              │
│ }                                                                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    判斷: isLinked = false
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 2: 導向手機驗證頁面                                          │
│ 發送驗證碼                                                        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ API: POST /service/account/sendconfirmcode                       │
│ Request Body: {                                                  │
│   username: "0900000001",                                        │
│   clientId: "aicreate360",                                       │
│   clientSecret: "3Fstg56cAe59f8?xDT9Hb81Kp567E78Ae"            │
│ }                                                                │
│                                                                  │
│ Response: {                                                      │
│   code: "0",                                                     │
│   message: "成功",                                               │
│   data: {                                                        │
│     ticket: "cc0717431d54473a9e22c4a244d5998c",                 │
│     confirmCode: "798235",  ← 測試環境會回傳                     │
│     isSuccessful: true,                                          │
│     username: "0900000001",                                      │
│     usernameType: "MOBILE"                                       │
│   }                                                              │
│ }                                                                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 3: 輸入驗證碼並驗證                                          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ API: POST /service/account/verifyconfirmcode                     │
│ Request Body: {                                                  │
│   username: "0900000001",                                        │
│   ticket: "cc0717431d54473a9e22c4a244d5998c",                   │
│   confirmCode: "798235",                                         │
│   clientId: "aicreate360",                                       │
│   clientSecret: "3Fstg56cAe59f8?xDT9Hb81Kp567E78Ae"            │
│ }                                                                │
│                                                                  │
│ Response: {                                                      │
│   code: "0",                                                     │
│   data: {                                                        │
│     isSuccessful: true,                                          │
│     registerToken: "abc123xyz..."  ← 用於後續註冊               │
│   }                                                              │
│ }                                                                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 4: 導向隱私政策頁面                                          │
│ 用戶勾選同意                                                      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
            判斷: existMembers.length = 0 (無現有會員卡)
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 5: 導向新會員註冊頁面                                        │
│ 填寫資料:                                                         │
│ - 設定密碼、確認密碼                                              │
│ - 姓名、生日、性別                                                │
│ - 地址 (縣市、鄉鎮區、詳細地址)                                   │
│ - Email、市話                                                    │
│ - 同意行銷方式 (簡訊、電訪、Email、郵寄)                          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ API: POST /service/account/registeraccount                       │
│ Request Body: {                                                  │
│   registerToken: "abc123xyz...",  ← 從驗證碼 API 取得            │
│   name: "王小明",                                                │
│   password: "Pass123",                                           │
│   birthday: "1990-01-01T00:00:00",                              │
│   sex: "M",  // "M" 或 "F"                                      │
│   zip: "",                                                       │
│   city: "臺北市",                                                │
│   district: "中正區",                                            │
│   address: "中山南路1號",                                        │
│   mobile: "0900000001",                                          │
│   email: "test@example.com",                                     │
│   homePhoneArea: "02",                                           │
│   homePhone: "12345678",                                         │
│   homePhoneExtension: "",                                        │
│   marketSurvey: "簡訊,Email",  // 逗號分隔                       │
│   favoriteShop: "",                                              │
│   clientId: "aicreate360",                                       │
│   clientSecret: "3Fstg56cAe59f8?xDT9Hb81Kp567E78Ae"            │
│ }                                                                │
│                                                                  │
│ Response: {                                                      │
│   code: "0",                                                     │
│   data: {                                                        │
│     serialNumber: "1234567890",  ← 會員系統編號                 │
│     memberCardNumber: "MC12345678",  ← 會員卡號                 │
│     accountId: 12345  ← SSO 帳號 ID                             │
│   }                                                              │
│ }                                                                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 取得登入 Token                                                    │
│                                                                  │
│ API: POST /newgateway/oauth/token                               │
│ Content-Type: application/x-www-form-urlencoded                 │
│ Request Body:                                                    │
│   grant_type=password                                            │
│   client_id=aicreate360                                          │
│   client_secret=3Fstg56cAe59f8?xDT9Hb81Kp567E78Ae               │
│   username=0900000001                                            │
│   password=Pass123                                               │
│                                                                  │
│ Response: {                                                      │
│   access_token: "eyJhbGc...",                                    │
│   token_type: "bearer",                                          │
│   expires_in: 863999                                             │
│ }                                                                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 🔄 發送登入資訊給後端系統                                         │
│                                                                  │
│ API: POST {BACKEND_LOGIN_URL}/api/gateway/login/{lineUserId}    │
│ Request Body: {                                                  │
│   username: "0900000001",                                        │
│   password: "Pass123",                                           │
│   accessToken: "eyJhbGc..."                                      │
│ }                                                                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 6: 註冊完成頁面                                              │
│ - 顯示「註冊成功」                                                │
│ - 恭喜您升級完成！取得會員點數2000點！                            │
│ - 按鈕「關閉視窗」                                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. 未註冊用戶 - 綁定現有會員卡流程

### 流程圖
```
┌─────────────────────────────────────────────────────────────────┐
│ STEP 1: 輸入手機號碼                                              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ API: POST /service/account/checkUsernameUsed                    │
│ Request Body: {                                                  │
│   username: "0911111111",                                        │
│   clientId: "aicreate360",                                       │
│   clientSecret: "3Fstg56cAe59f8?xDT9Hb81Kp567E78Ae"            │
│ }                                                                │
│                                                                  │
│ Response: {                                                      │
│   code: "0",                                                     │
│   data: {                                                        │
│     isLinked: false,  ← 未綁定到 SSO                            │
│     usernameType: "MOBILE",                                      │
│     existMembers: [  ← 有現有會員卡資料                         │
│       {                                                          │
│         ssoAccountId: 123,                                       │
│         serialNumber: "9876543210",                              │
│         name: "張小華",                                          │
│         point: 5000,                                             │
│         joinMethod: "門市",                                      │
│         joinDate: "2020-01-15",                                  │
│         lastBuyDate: "2024-03-01",                               │
│         hasECAccount: false  ← 是否有 EC 舊帳號                 │
│       },                                                         │
│       {                                                          │
│         ssoAccountId: 456,                                       │
│         serialNumber: "1111222233",                              │
│         name: "張小華",                                          │
│         point: 3000,                                             │
│         hasECAccount: true  ← 有 EC 帳號,需要驗證密碼            │
│       }                                                          │
│     ]                                                            │
│   }                                                              │
│ }                                                                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 2-4: 與新會員註冊流程相同                                    │
│ - 發送驗證碼                                                      │
│ - 驗證驗證碼                                                      │
│ - 同意隱私政策                                                    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
          判斷: existMembers.length > 0 (有現有會員卡)
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 5: 導向綁定會員卡頁面                                        │
│ 顯示所有可綁定的會員卡,用戶選擇一張                                │
│                                                                  │
│ 情況 A: hasECAccount = true (有 EC 帳號)                        │
│   → 顯示「請輸入原會員密碼」                                      │
│                                                                  │
│ 情況 B: hasECAccount = false (無 EC 帳號)                       │
│   → 顯示「請設定新密碼」+ 「確認新密碼」                          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ API: POST /service/account/registerlink                          │
│                                                                  │
│ 情況 A - 有 EC 帳號 (需驗證原密碼):                              │
│ Request Body: {                                                  │
│   registerToken: "abc123xyz...",                                 │
│   ssoAccountId: 456,  ← 選擇的會員卡 ID                          │
│   serialNumber: "1111222233",                                    │
│   needVerifyUserAccount: true,  ← 需要驗證                       │
│   ssoUserAccount: "0911111111",  ← 手機號碼                      │
│   password: "OldPass123",  ← 用戶輸入的原密碼                    │
│   clientId: "aicreate360",                                       │
│   clientSecret: "3Fstg56cAe59f8?xDT9Hb81Kp567E78Ae"            │
│ }                                                                │
│                                                                  │
│ 情況 B - 無 EC 帳號 (設定新密碼):                                │
│ Request Body: {                                                  │
│   registerToken: "abc123xyz...",                                 │
│   ssoAccountId: 123,                                             │
│   serialNumber: "9876543210",                                    │
│   needVerifyUserAccount: false,  ← 不需驗證                      │
│   ssoUserAccount: "",                                            │
│   password: "NewPass123",  ← 用戶設定的新密碼                    │
│   clientId: "aicreate360",                                       │
│   clientSecret: "3Fstg56cAe59f8?xDT9Hb81Kp567E78Ae"            │
│ }                                                                │
│                                                                  │
│ Response: {                                                      │
│   code: "0",                                                     │
│   data: {                                                        │
│     serialNumber: "9876543210",                                  │
│     memberCardNumber: "MC87654321",                              │
│     accountId: 789                                               │
│   }                                                              │
│ }                                                                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 取得登入 Token                                                    │
│                                                                  │
│ API: POST /newgateway/oauth/token                               │
│ Content-Type: application/x-www-form-urlencoded                 │
│ Request Body:                                                    │
│   grant_type=password                                            │
│   client_id=aicreate360                                          │
│   client_secret=3Fstg56cAe59f8?xDT9Hb81Kp567E78Ae               │
│   username=0911111111                                            │
│   password=NewPass123 或 OldPass123                              │
│                                                                  │
│ Response: {                                                      │
│   access_token: "eyJhbGc...",                                    │
│   token_type: "bearer",                                          │
│   expires_in: 863999                                             │
│ }                                                                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 🔄 發送登入資訊給後端系統                                         │
│                                                                  │
│ API: POST {BACKEND_LOGIN_URL}/api/gateway/login/{lineUserId}    │
│ Request Body: {                                                  │
│   username: "0911111111",                                        │
│   password: "NewPass123",                                        │
│   accessToken: "eyJhbGc..."                                      │
│ }                                                                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 6: 綁定完成頁面                                              │
│ - 顯示「登入完成」                                                │
│ - 恭喜您升級完成！取得會員點數2000點！                            │
│ - 按鈕「關閉視窗」                                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. 忘記密碼流程

### 流程圖
```
┌─────────────────────────────────────────────────────────────────┐
│ STEP 1: 忘記密碼頁面                                              │
│ 輸入手機號碼                                                      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ API: POST /service/account/resetPassword                         │
│ Request Body: {                                                  │
│   username: "0912345678",                                        │
│   clientId: "aicreate360",                                       │
│   clientSecret: "3Fstg56cAe59f8?xDT9Hb81Kp567E78Ae"            │
│ }                                                                │
│                                                                  │
│ Response: {                                                      │
│   code: "0",                                                     │
│   message: "成功",                                               │
│   data: {                                                        │
│     // 系統會自動產生新密碼並以簡訊發送給用戶                     │
│   }                                                              │
│ }                                                                │
│                                                                  │
│ ⚠️ 說明:                                                         │
│ - 此 API 會自動產生隨機密碼                                       │
│ - 新密碼會以簡訊發送到用戶手機                                    │
│ - 用戶收到簡訊後使用新密碼登入                                    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 2: 導向密碼登入頁面                                          │
│ 用戶使用簡訊收到的新密碼登入                                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. 後端接收資料規格

### 🔄 後端系統接收 API (LINE 綁定用)

#### Endpoint
```
POST {BACKEND_LOGIN_URL}/api/gateway/login/{lineUserId}
```

#### 範例 URL
```
POST https://line.uat.tatung2025.aitago.tw/api/gateway/login/U1234567890abcdef
```

#### Request Headers
```json
{
  "Accept": "application/json",
  "Content-Type": "application/json"
}
```

#### Request Body
```json
{
  "username": "0912345678",
  "password": "Pass123",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Request Body 欄位說明

| 欄位 | 類型 | 必填 | 說明 |
|------|------|------|------|
| `username` | String | ✅ | 用戶手機號碼 (大同會員帳號) |
| `password` | String | ✅ | 用戶密碼 (明文) |
| `accessToken` | String | ✅ | 從大同 SSO 取得的 OAuth Token |

#### Path Parameters

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| `lineUserId` | String | ✅ | LINE 用戶 ID (從 LIFF SDK 取得) |

#### 呼叫時機

此 API 會在以下時機被呼叫:
1. ✅ **已註冊用戶密碼登入成功後**
2. ✅ **新會員註冊完成後**
3. ✅ **綁定會員卡完成後**

#### 後端需要處理的事項

1. **儲存綁定關係**
   ```
   LINE User ID ↔ 大同會員帳號 (username)
   ```

2. **儲存 Access Token** (可選)
   - 用於後續呼叫大同 SSO Member API
   - Token 有效期: 約 240 小時 (10 天)
   - 可用於查詢會員點數、優惠券等資料

3. **回傳格式建議**
   ```json
   {
     "success": true,
     "message": "綁定成功",
     "data": {
       "lineUserId": "U1234567890abcdef",
       "username": "0912345678",
       "bindTime": "2024-03-24T08:00:00Z"
     }
   }
   ```

#### 錯誤處理

前端會捕捉錯誤但不會中斷流程:
```javascript
try {
  await ApiService.sendLoginToBackend(lineUserId, username, password);
  console.log('✅ 已發送登入資訊給後端系統');
} catch (err) {
  console.warn('⚠️ 發送登入資訊失敗，但不影響登入流程', err);
}
```

即使此 API 失敗,用戶仍可完成登入流程。

---

## 📝 補充說明

### API Base URL
```
正式環境: https://tatungssodev.azurewebsites.net
```

### OAuth Client 憑證
```
Client ID: aicreate360
Client Secret: 3Fstg56cAe59f8?xDT9Hb81Kp567E78Ae
```

### 密碼規則
- 長度: 6-20 字元
- 必須包含至少一個數字
- 必須包含至少一個英文字母 (大小寫皆可)

### 手機號碼格式
- 格式: 09 開頭,共 10 碼
- 範例: `0912345678`

### 測試環境特性
- `sendconfirmcode` API 會在 Response 中直接回傳驗證碼 (`confirmCode`)
- 方便測試,生產環境不會回傳

### 重要提醒
- ⚠️ 所有 `/service/account/*` API 不需要 Bearer Token,使用 `clientId` 和 `clientSecret` 即可
- ⚠️ 所有 `/service/member/*` API 需要 Bearer Token (在 Authorization Header)
- ⚠️ `registerToken` 只能使用一次,用於註冊或綁定流程
- ⚠️ `ticket` 在發送驗證碼時取得,用於驗證驗證碼

---

## 📞 聯絡資訊

如有 API 相關問題,請聯絡:
- 客服專線: (02) 2591-5068
- 服務時間: 週一～週六 9:00～18:00 (國定例假日除外)
