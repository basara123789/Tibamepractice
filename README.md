# 銀行優惠比較網站

一個現代化的AI驅動銀行優惠比較平台，具有智能信用卡推薦、用戶認證系統和專業級UI設計。

![網站預覽](https://img.shields.io/badge/狀態-線上-success)
![技術棧](https://img.shields.io/badge/技術棧-現代前端-blue)
![部署](https://img.shields.io/badge/部署-Netlify-orange)

## ✨ 功能特色

### 🤖 AI智能推薦
- 基於Google Gemini/Groq API的智能信用卡推薦
- 自然語言對話界面
- 即時個性化建議

### 🔐 用戶系統
- Google單點登入（Firebase Authentication）
- 用戶狀態管理
- 個人化體驗

### 🎨 現代UI設計
- **玻璃態設計** (Glassmorphism)
- **3D卡片效果**：滑鼠懸停3D旋轉
- **磁性按鈕**：按鈕跟隨滑鼠移動
- **視差滾動**：背景元素分層滾動
- **漣漪效果**：點擊時水波紋擴散
- **完全響應式**：支援桌面、平板、手機

### 📊 數據可視化
- 即時統計計數器
- 優惠卡片網格佈局
- 銀行合作夥伴展示

## 🏗️ 技術架構

### 前端
- **HTML5** / **CSS3** / **JavaScript (ES6+)**
- **Firebase**：用戶認證 + 實時數據庫
- **Font Awesome**：圖標庫

### 後端
- **Netlify Functions**：無服務器架構
- **Google Gemini API** / **Groq API**：AI服務

### 自動化工具
- **Python** + **python-pptx**：演示文稿生成

## 📁 項目結構

```
bank-offers-project/
├── index.html          # 主頁面
├── style.css          # 樣式文件
├── script.js          # 前端邏輯
├── create_pptx.py     # Python演示文稿生成
├── netlify.toml       # Netlify配置
├── wireframe.html     # 線框圖
└── netlify/
    └── functions/
        └── chat.js    # AI聊天後端函數
```

## 🚀 快速開始

### 本地開發

1. **克隆項目**
   ```bash
   git clone https://github.com/yourusername/bank-offers-project.git
   cd bank-offers-project
   ```

2. **直接運行**
   - 直接打開 `index.html` 文件
   - 或使用本地服務器：
     ```bash
     npx live-server
     ```

### 環境變量配置

#### 1. Firebase配置
在 `script.js` 中配置Firebase：
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

#### 2. AI API配置（Netlify環境變量）
在Netlify控制台設置：
- `GROQ_API_KEY`：Groq API密鑰（推薦）
- `GEMINI_API_KEY`：Google Gemini API密鑰（備用）

## 🌐 部署指南

### 選項A：Netlify部署（推薦）

1. **推送到GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/bank-offers-project.git
   git push -u origin main
   ```

2. **Netlify設置**
   - 登錄 [Netlify](https://app.netlify.com)
   - 選擇 "New site from Git"
   - 連接GitHub倉庫
   - 配置構建設置：
     - Build command: (留空，靜態網站)
     - Publish directory: `.`
   - 添加環境變量：
     - `GROQ_API_KEY`: 你的Groq API密鑰
     - `GEMINI_API_KEY`: 你的Gemini API密鑰

3. **部署完成**
   - Netlify會自動部署
   - 獲得專屬域名：`your-site.netlify.app`

### 選項B：GitHub Pages

1. **調整API端點**
   修改 `script.js` 中的API端點：
   ```javascript
   // 從Netlify Functions改為你的後端服務
   const API_ENDPOINT = 'https://your-backend.com/api/chat';
   ```

2. **推送到GitHub**
   ```bash
   git push origin main
   ```

3. **啟用GitHub Pages**
   - 進入倉庫 Settings → Pages
   - Source: 選擇 `main` 分支
   - Folder: `/` (根目錄)

## 🔧 高級配置

### 自定義Firebase項目

1. 創建Firebase項目
2. 啟用Authentication（Google登入）
3. 啟用Realtime Database
4. 更新 `script.js` 中的配置

### 使用其他AI服務

修改 `netlify/functions/chat.js`：
```javascript
// 替換為OpenAI、Claude等其他AI服務
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'gpt-4',
    messages: [...]
  })
});
```

## 📱 響應式設計

網站支援所有設備：
- **桌面**：完整功能 + 3D效果
- **平板**：優化佈局
- **手機**：觸摸友好界面

## 🎯 核心功能代碼

### AI聊天功能
```javascript
async function handleSend() {
  const response = await fetch('/.netlify/functions/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: userText })
  });
  // 處理AI回應...
}
```

### 3D卡片效果
```javascript
function setup3DTiltEffects() {
  card.style.transform = `
    perspective(1000px) 
    rotateX(${rotateX}deg) 
    rotateY(${rotateY}deg) 
    translateZ(10px)
    scale(1.02)
  `;
}
```

## 🤝 貢獻指南

1. Fork項目
2. 創建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟Pull Request

## 📄 許可證

MIT License - 詳見 [LICENSE](LICENSE) 文件

## 📞 聯繫方式

如有問題或建議，請：
- 開啟 [Issue](https://github.com/yourusername/bank-offers-project/issues)
- 發送郵件至：your-email@example.com

---

⭐ 如果這個項目對你有幫助，請給個Star！
