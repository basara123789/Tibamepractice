# 部署指南 - Netlify + GitHub

## 📋 前置要求

1. **GitHub帳號** - [註冊 GitHub](https://github.com/signup)
2. **Netlify帳號** - [註冊 Netlify](https://app.netlify.com/signup)
3. **Firebase項目** - [創建 Firebase 項目](https://console.firebase.google.com)
4. **AI API密鑰** (二選一)：
   - [Groq API 密鑰](https://console.groq.com)
   - [Google Gemini API 密鑰](https://makersuite.google.com/app/apikey)

## 🚀 部署步驟

### 步驟 1: 推送到 GitHub

#### 選項 A: 使用現有 GitHub 倉庫
```bash
# 添加遠程倉庫
git remote add origin https://github.com/你的用戶名/bank-offers-project.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

#### 選項 B: 創建新 GitHub 倉庫
1. 訪問 [GitHub](https://github.com/new)
2. 創建新倉庫：`bank-offers-project`
3. 不要初始化 README、.gitignore 或 license
4. 按照 GitHub 提供的指示推送上傳：
   ```bash
   git remote add origin https://github.com/你的用戶名/bank-offers-project.git
   git branch -M main
   git push -u origin main
   ```

### 步驟 2: Netlify 部署

1. **登錄 Netlify**
   - 訪問 [Netlify](https://app.netlify.com)
   - 使用 GitHub 帳號登錄

2. **從 Git 創建新站點**
   - 點擊 "New site from Git"
   - 選擇 "GitHub"
   - 授權 Netlify 訪問你的 GitHub 倉庫

3. **選擇倉庫**
   - 選擇 `bank-offers-project` 倉庫
   - 點擊 "Deploy site"

4. **配置構建設置**
   - Build command: (留空，因為是靜態網站)
   - Publish directory: `.` (根目錄)
   - 點擊 "Deploy site"

### 步驟 3: 配置環境變量

在 Netlify 控制台：

1. 進入站點設置：Site settings → Build & deploy → Environment
2. 添加以下環境變量：

#### 必需變量 (至少一個)
```
GROQ_API_KEY=你的_Groq_API_密鑰
```
或
```
GEMINI_API_KEY=你的_Gemini_API_密鑰
```

#### 可選變量
```
NODE_ENV=production
```

3. 點擊 "Save"

### 步驟 4: 重新部署

1. 進入 Netlify 控制台
2. 選擇你的站點
3. 點擊 "Deploys" 標籤
4. 點擊 "Trigger deploy" → "Deploy site"

## 🔧 Firebase 配置

### 1. 創建 Firebase 項目
1. 訪問 [Firebase Console](https://console.firebase.google.com)
2. 點擊 "Add project"
3. 輸入項目名稱：`bank-offers-native`
4. 啟用 Google Analytics (可選)
5. 創建項目

### 2. 配置 Authentication
1. 左側菜單：Build → Authentication
2. 點擊 "Get started"
3. 選擇 "Google" 提供商
4. 啟用 Google 登入
5. 添加授權域名：
   - `localhost`
   - `你的站點.netlify.app`

### 3. 配置 Realtime Database
1. 左側菜單：Build → Realtime Database
2. 點擊 "Create database"
3. 選擇區域：`asia-southeast1` (新加坡)
4. 啟用測試模式

### 4. 獲取 Firebase 配置
1. 項目設置 → 常規
2. 滾動到 "Your apps"
3. 點擊 "Web" 圖標 (</>)
4. 註冊應用：`bank-offers-web`
5. 複製 Firebase 配置

### 5. 更新 script.js
更新 `script.js` 中的 Firebase 配置：
```javascript
const firebaseConfig = {
  apiKey: "你的_API_KEY",
  authDomain: "你的_AUTH_DOMAIN",
  databaseURL: "你的_DATABASE_URL",
  projectId: "你的_PROJECT_ID",
  storageBucket: "你的_STORAGE_BUCKET",
  messagingSenderId: "你的_SENDER_ID",
  appId: "你的_APP_ID"
};
```

## 🐛 故障排除

### 問題 1: AI 聊天功能無法工作
**症狀**: 點擊發送按鈕沒有反應
**解決方案**:
1. 檢查 Netlify 環境變量是否正確設置
2. 查看 Netlify Functions 日誌：
   - Netlify 控制台 → Functions → chat
   - 檢查是否有錯誤訊息

### 問題 2: Google 登入失敗
**症狀**: 點擊登入按鈕彈出錯誤
**解決方案**:
1. 檢查 Firebase Authentication 是否啟用 Google 登入
2. 確認授權域名已添加
3. 檢查 Firebase API 密鑰是否正確

### 問題 3: 網站無法加載
**症狀**: 白屏或 404 錯誤
**解決方案**:
1. 檢查 Netlify 部署日誌
2. 確認 `index.html` 在根目錄
3. 檢查是否有構建錯誤

### 問題 4: 環境變量未生效
**症狀**: AI 功能返回 API 密鑰錯誤
**解決方案**:
1. 重新部署站點
2. 檢查環境變量名稱是否正確
3. 確認密鑰是否有權限

## 📊 監控和維護

### 查看日誌
1. **Netlify Functions 日誌**:
   - Netlify 控制台 → Functions → chat
   - 查看調用和錯誤

2. **Firebase 日誌**:
   - Firebase 控制台 → Analytics → Events
   - 查看用戶活動

### 更新部署
當代碼更新時：
```bash
# 本地更改
git add .
git commit -m "更新描述"

# 推送到 GitHub
git push origin main

# Netlify 會自動部署
```

### 備份配置
建議備份：
1. Firebase 配置
2. Netlify 環境變量
3. GitHub 倉庫

## 🔒 安全建議

### API 密鑰安全
1. **永遠不要**將真實 API 密鑰提交到 GitHub
2. 使用環境變量存儲敏感信息
3. 定期輪換 API 密鑰

### Firebase 安全規則
更新 Firebase Realtime Database 規則：
```json
{
  "rules": {
    "stats": {
      "global": {
        ".read": true,
        ".write": false  // 僅通過代碼更新
      }
    }
  }
}
```

### 域名保護
1. 啟用 HTTPS (Netlify 自動提供)
2. 設置自定義域名
3. 啟用 HTTP/2

## 🌐 自定義域名

### 添加自定義域名
1. Netlify 控制台 → Domain settings
2. 點擊 "Add custom domain"
3. 輸入你的域名
4. 按照指示配置 DNS

### 配置 SSL
1. Netlify 自動提供 Let's Encrypt SSL
2. 強制 HTTPS：Site settings → Domain management → HTTPS → Force HTTPS

## 📈 性能優化

### 前端優化
1. 啟用瀏覽器緩存
2. 壓縮靜態資源
3. 使用 CDN (Netlify 自動提供)

### 後端優化
1. 緩存 AI 回應
2. 限制 API 調用頻率
3. 監控函數執行時間

## 🆘 獲取幫助

### 官方文檔
- [Netlify 文檔](https://docs.netlify.com/)
- [Firebase 文檔](https://firebase.google.com/docs)
- [GitHub 文檔](https://docs.github.com/)

### 社區支持
- [Netlify 社區](https://community.netlify.com/)
- [Firebase 社區](https://firebase.community/)
- [Stack Overflow](https://stackoverflow.com/)

### 聯繫維護者
如有問題，請：
1. 開啟 [GitHub Issue](https://github.com/你的用戶名/bank-offers-project/issues)
2. 檢查 [FAQ](#) 部分
3. 參考錯誤日誌

---

✅ **部署完成！** 你的網站現在應該運行在：`https://你的站點.netlify.app`

下次更新時，只需推送到 GitHub，Netlify 會自動部署。
