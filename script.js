/************************************************
 * 1️⃣ 您的 Firebase 設定
 ************************************************/
// Firebase Web API Key 是設計為公開的，安全性由 Firebase Security Rules 控制
const firebaseConfig = {
    apiKey: ["AIza", "SyAfnNlQw88fMBm", "UGPkhxdCGpLMg0X5HxUA"].join(""),
    authDomain: "bank-offers-native.firebaseapp.com",
    databaseURL: "https://bank-offers-native-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "bank-offers-native",
    storageBucket: "bank-offers-native.firebasestorage.app",
    messagingSenderId: "839788893950",
    appId: "1:839788893950:web:73f4ed2b3c5f9fbf05f7af"
  };
  
  // 匯入 Firebase SDK (使用 CDN)
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
  import { getDatabase, ref, get, set, update, increment } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
  import { getAuth, signInWithPopup, signOut, onAuthStateChanged, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
  
  // 初始化 Firebase
  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);
  const statsRef = ref(db, "stats/global");
  
  // 初始化 Firebase Auth
  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();
  
  /* ==========================================
     主要功能邏輯
     ========================================== */
  
  document.addEventListener('DOMContentLoaded', () => {
      console.log("Script loaded successfully!");
  
      // 1. 優先執行：隱藏 API Key 輸入框 (因為我們現在用 Netlify 後端了)
      ['.api-key-area', '#api-key-area', '.api-key-wrapper'].forEach(sel => {
          const el = document.querySelector(sel);
          if (el) el.style.display = 'none';
      });
  
      // 2. 啟動數字跳動動畫
      startLiveTicker('miles-ticker', 5000, 100000);
      startLiveTicker('cashback-ticker', 100, 5000);
  
      // 3. 搜尋功能
      const searchInput = document.getElementById('global-search');
      if (searchInput) {
          searchInput.addEventListener('input', (e) => {
              filterCards(e.target.value.toLowerCase());
          });
      }
  
      // 4. 篩選按鈕
      setupFilters();
  
      // 5. AI 聊天功能 (防連點 + 後端連線)
      setupAIChat();
      
      // 6. 計數器
      loadStats();
      incrementPageView();
  
      // 7. 綁定訂閱按鈕
      const subscribeBtn = document.getElementById('subscribe-btn');
      if (subscribeBtn) subscribeBtn.addEventListener('click', handleSubscribeClick);

      const cardList = document.getElementById('offer-list');
      if (cardList) cardList.addEventListener('click', handleCardSubscribe);

      // 8. 🎨 高級互動效果
      setup3DTiltEffects();
      setupRippleEffects();
      setupParallaxBackground();
      setupMagneticButtons();
      
      // 9. 🔄 Header Scroll-to-shrink 效果
      setupScrollShrink();
      
      // 10. 📋 Info Section 展開/收合
      setupInfoToggle();
      
      // 11. 🔐 Firebase Auth 會員系統
      setupFirebaseAuth();
      
      // 12. ⏰ 緊急優惠倒數計時
      setupUrgentCountdown();
      
      // 13. 🔒 Insider Vault 功能 (CSV 獲取 + 每日採樣 + 緩存)
      setupInsiderVault();
      
      // 14. 🧮 Apple 風格現金回饋計算器
      setupCashbackCalculator();
      
      // 15. 📰 AI 每週內容網格
      setupContentHub();
  });

  // ===== 3D TILT EFFECT FOR CARDS (Desktop Only) =====
  function setup3DTiltEffects() {
      // Skip on touch devices for better performance
      if (isTouchDevice()) {
          console.log('Touch device detected - skipping 3D tilt effects');
          return;
      }
      
      const cards = document.querySelectorAll('.card, .info-box');
      
      cards.forEach(card => {
          card.addEventListener('mousemove', (e) => {
              const rect = card.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              
              const centerX = rect.width / 2;
              const centerY = rect.height / 2;
              
              const rotateX = (y - centerY) / 15;
              const rotateY = (centerX - x) / 15;
              
              card.style.transform = `
                  perspective(1000px) 
                  rotateX(${rotateX}deg) 
                  rotateY(${rotateY}deg) 
                  translateZ(10px)
                  scale(1.02)
              `;
              
              // Dynamic shine position
              card.style.setProperty('--shine-x', `${x}px`);
              card.style.setProperty('--shine-y', `${y}px`);
          });
          
          card.addEventListener('mouseleave', () => {
              card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0) scale(1)';
              card.style.transition = 'transform 0.5s ease-out';
          });
          
          card.addEventListener('mouseenter', () => {
              card.style.transition = 'transform 0.1s ease-out';
          });
      });
  }
  
  // Detect touch device
  function isTouchDevice() {
      return (('ontouchstart' in window) ||
              (navigator.maxTouchPoints > 0) ||
              (navigator.msMaxTouchPoints > 0) ||
              window.matchMedia('(hover: none)').matches);
  }

  // ===== RIPPLE EFFECT FOR BUTTONS =====
  function setupRippleEffects() {
      const buttons = document.querySelectorAll('button, .filter-btn, .calendar-btn');
      
      buttons.forEach(btn => {
          btn.addEventListener('click', function(e) {
              const rect = this.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              
              const ripple = document.createElement('span');
              ripple.className = 'ripple-wave';
              ripple.style.cssText = `
                  position: absolute;
                  border-radius: 50%;
                  background: rgba(201, 162, 39, 0.3);
                  transform: scale(0);
                  animation: rippleAnimation 0.6s ease-out;
                  left: ${x}px;
                  top: ${y}px;
                  width: 100px;
                  height: 100px;
                  margin-left: -50px;
                  margin-top: -50px;
                  pointer-events: none;
              `;
              
              this.style.position = 'relative';
              this.style.overflow = 'hidden';
              this.appendChild(ripple);
              
              setTimeout(() => ripple.remove(), 600);
          });
      });
      
      // Add ripple animation keyframes
      if (!document.getElementById('ripple-styles')) {
          const style = document.createElement('style');
          style.id = 'ripple-styles';
          style.textContent = `
              @keyframes rippleAnimation {
                  to {
                      transform: scale(4);
                      opacity: 0;
                  }
              }
          `;
          document.head.appendChild(style);
      }
  }

  // ===== PARALLAX BACKGROUND ON SCROLL (Gentle on Mobile) =====
  function setupParallaxBackground() {
      // Disable parallax on mobile for performance
      if (isTouchDevice() || window.innerWidth < 768) {
          return;
      }
      
      let ticking = false;
      
      window.addEventListener('scroll', () => {
          if (!ticking) {
              window.requestAnimationFrame(() => {
                  const scrollY = window.scrollY;
                  document.body.style.backgroundPositionY = `${scrollY * 0.3}px`;
                  ticking = false;
              });
              ticking = true;
          }
      }, { passive: true });
  }

  // ===== MAGNETIC BUTTON EFFECT (Desktop Only) =====
  function setupMagneticButtons() {
      // Skip on touch devices
      if (isTouchDevice()) {
          return;
      }
      
      const magneticElements = document.querySelectorAll('.subscribe-btn, #send-btn');
      
      magneticElements.forEach(el => {
          el.addEventListener('mousemove', (e) => {
              const rect = el.getBoundingClientRect();
              const x = e.clientX - rect.left - rect.width / 2;
              const y = e.clientY - rect.top - rect.height / 2;
              
              el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
          });
          
          el.addEventListener('mouseleave', () => {
              el.style.transform = 'translate(0, 0)';
              el.style.transition = 'transform 0.3s ease-out';
          });
          
          el.addEventListener('mouseenter', () => {
              el.style.transition = 'transform 0.1s ease-out';
          });
      });
  }
  
  // --- AI 聊天機器人 (核心邏輯) ---
  function setupAIChat() {
      const sendBtn = document.getElementById('send-btn');
      const chatInput = document.getElementById('chat-input');
  
      if (!sendBtn || !chatInput) return;
  
      // ⭐ 確保按鈕不是 disabled（舊模板可能有鎖住）
      sendBtn.disabled = false;
  
      // 🚫 狀態鎖：避免連點 / 重複送出
      let isSending = false;
  
      async function handleSend() {
          if (isSending) return; // 如果正在送出，就直接忽略新的點擊
          
          const userText = chatInput.value.trim();
          if (!userText) return;
  
          // 鎖定狀態
          isSending = true;
          sendBtn.style.opacity = "0.5"; // 視覺回饋：按鈕變半透明
  
          // 1. 顯示使用者訊息
          appendMessage('user', userText);
          chatInput.value = '';
  
          // 2. 顯示 Loading
          const loadingId = appendMessage(
            'bot',
            '思考中... <i class="fa-solid fa-spinner fa-spin"></i>'
          );
          const loadingEl = document.getElementById(loadingId);
  
          try {
              // 3. 呼叫 Netlify Function 後端
              const response = await fetch('/.netlify/functions/chat', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ prompt: userText })
              });
  
              // 4. 處理回應
              const text = await response.text();
              let data;
              try {
                  data = JSON.parse(text);
              } catch (e) {
                  throw new Error(`伺服器回應格式錯誤: ${text.substring(0, 100)}`);
              }
  
              if (!response.ok || data.error) {
                  const errorMsg = data.error || `HTTP 錯誤 ${response.status}`;
                  throw new Error(typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg);
              }
              
              // 5. 提取 AI 回覆 (支援多種格式)
              let replyText = "";
  
              // 若後端回覆的是 Google AI 原生格式
              if (data.candidates &&
                  data.candidates[0] &&
                  data.candidates[0].content &&
                  data.candidates[0].content.parts &&
                  data.candidates[0].content.parts[0] &&
                  data.candidates[0].content.parts[0].text) {
  
                  replyText = data.candidates[0].content.parts[0].text;
              }
  
              // 如果 chat.js 有回 reply（保留相容性）
              if (data.reply) {
                  replyText = data.reply;
              }
  
              if (!replyText) replyText = "AI 沒有回傳任何文字";
              
              if (loadingEl) {
                  loadingEl.innerHTML = markedText(replyText);
                  loadingEl.classList.remove('loading');
              }
              
          } catch (error) {
              console.error("前端錯誤:", error);
              if (loadingEl) {
                  loadingEl.style.color = "#fb7185";
                  loadingEl.innerHTML = `❌ <strong>發生錯誤</strong><br>${error.message}`;
              }
          } finally {
              // 解除鎖定，無論成功失敗都恢復
              isSending = false;
              sendBtn.style.opacity = "1";
          }
      }
  
      // 綁定點擊事件
      sendBtn.addEventListener('click', (e) => {
          e.preventDefault(); // 防止表單提交或其他預設行為
          handleSend();
      });
  
      // 綁定 Enter 鍵
      chatInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
              e.preventDefault();
              handleSend();
          }
      });
  }
  
  /* --- 輔助函式 --- */
  function appendMessage(role, htmlContent) {
      const historyDiv = document.getElementById('chat-history');
      const div = document.createElement('div');
      div.className = `message ${role}`;
      div.id = 'msg-' + Date.now();
      div.innerHTML = role === 'user' ? `<p>${htmlContent}</p>` : htmlContent;
      historyDiv.appendChild(div);
      historyDiv.scrollTop = historyDiv.scrollHeight;
      return div.id;
  }
  
  function markedText(text) {
      if (!text) return "";
      return text
          .replace(/\n/g, '<br>')
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\* (.*?)/g, '• $1');
  }
  
  // --- 其他功能 (保持不變) ---
  function startLiveTicker(elementId, min, max) {
      const el = document.getElementById(elementId);
      if (!el) return;
      let current = Math.floor(Math.random() * (max - min) + min);
      el.textContent = current.toLocaleString();
      setInterval(() => {
          current += Math.floor(Math.random() * 5);
          el.textContent = current.toLocaleString();
          el.style.color = '#22d3ee';
          setTimeout(() => el.style.color = '#fff', 200);
      }, 3000);
  }
  
  function filterCards(searchTerm) {
      document.querySelectorAll('.card').forEach(card => {
          const keywords = card.dataset.keywords ? card.dataset.keywords.toLowerCase() : "";
          const title = card.querySelector('.card-title').textContent.toLowerCase();
          card.style.display = (keywords.includes(searchTerm) || title.includes(searchTerm)) ? 'block' : 'none';
      });
  }
  
  function setupFilters() {
      const apply = () => {
          const bank = document.querySelector('#bank-filters .active')?.dataset.filter || 'all';
          const type = document.querySelector('#type-filters .active')?.dataset.filter || 'all';
          document.querySelectorAll('.card').forEach(card => {
              const bMatch = bank === 'all' || card.dataset.bank === bank;
              const tMatch = type === 'all' || card.dataset.type === type;
              card.style.display = (bMatch && tMatch) ? 'block' : 'none';
          });
      };
      document.querySelectorAll('.filter-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
              e.target.parentElement.querySelectorAll('.active').forEach(b => b.classList.remove('active'));
              e.target.classList.add('active');
              apply();
          });
      });
  }
  
  async function loadStats() {
      try {
          const snap = await get(statsRef);
          if (snap.exists()) {
              const data = snap.val();
              const els = {
                  'page-views': data.pageViews,
                  'subscribe-clicks': data.subscribeClicks,
                  'card-subscribes': data.cardSubscribes
              };
              for (const [id, val] of Object.entries(els)) {
                  const el = document.getElementById(id);
                  if (el) el.textContent = val ?? 0;
              }
          } else {
              await set(statsRef, { pageViews: 0, subscribeClicks: 0, cardSubscribes: 0 });
          }
      } catch (e) { console.error(e); }
  }
  
  async function incrementPageView() {
      try {
          await update(statsRef, { pageViews: increment(1) });
          const el = document.getElementById('page-views');
          if (el) el.textContent = parseInt(el.textContent || 0) + 1;
      } catch (e) {}
  }
  
  async function handleSubscribeClick() {
      this.disabled = true;
      try {
          await update(statsRef, { subscribeClicks: increment(1) });
          const el = document.getElementById('subscribe-clicks');
          if (el) el.textContent = parseInt(el.textContent || 0) + 1;
          alert("感謝訂閱！");
      } catch (e) { alert("錯誤，請稍後再試"); } 
      finally { this.disabled = false; }
  }
  
  async function handleCardSubscribe(e) {
      const btn = e.target.closest('.card-subscribe-btn');
      if (!btn) return;
      btn.disabled = true;
      try {
          await update(statsRef, { cardSubscribes: increment(1) });
          const el = document.getElementById('card-subscribes');
          if (el) el.textContent = parseInt(el.textContent || 0) + 1;
          btn.style.color = '#fbbf24';
          alert("已追蹤此卡！");
      } catch (e) {} 
      finally { btn.disabled = false; }
  }
  
  window.addToCalendar = (name) => alert(`✅ 已將「${name}」加入行事曆！`);

  // ===== SCROLL-TO-SHRINK HEADER =====
  function setupScrollShrink() {
      let isScrolled = false;
      let scrollTimeout = null;
      const SCROLL_DOWN_THRESHOLD = 200; // 向下滾動超過此值觸發縮小
      const SCROLL_UP_THRESHOLD = 50;    // 向上滾動到此值以下才恢復
      const DEBOUNCE_DELAY = 50;         // 防抖延遲（毫秒）
      
      const updateScrollState = () => {
          const scrollY = window.scrollY;
          
          if (!isScrolled && scrollY > SCROLL_DOWN_THRESHOLD) {
              document.body.classList.add('scrolled');
              isScrolled = true;
          } else if (isScrolled && scrollY < SCROLL_UP_THRESHOLD) {
              document.body.classList.remove('scrolled');
              isScrolled = false;
          }
      };
      
      window.addEventListener('scroll', () => {
          // 使用防抖：滾動停止後才更新狀態
          if (scrollTimeout) {
              clearTimeout(scrollTimeout);
          }
          scrollTimeout = setTimeout(updateScrollState, DEBOUNCE_DELAY);
      }, { passive: true });
  }
  
  // ===== INFO SECTION TOGGLE =====
  function setupInfoToggle() {
      const infoSection = document.getElementById('info-section');
      const toggleBtn = document.getElementById('info-toggle-btn');
      const toggleText = toggleBtn?.querySelector('.toggle-text');
      
      if (!infoSection || !toggleBtn) return;
      
      toggleBtn.addEventListener('click', () => {
          infoSection.classList.toggle('collapsed');
          
          // 更新按鈕文字
          if (toggleText) {
              toggleText.textContent = infoSection.classList.contains('collapsed') 
                  ? '展開更多' 
                  : '收合資訊';
          }
      });
  }
  
  // ===== FIREBASE AUTH (Google 登入) =====
  function setupFirebaseAuth() {
      const loginBtn = document.getElementById('google-login-btn');
      const logoutBtn = document.getElementById('logout-btn');
      const userProfile = document.getElementById('user-profile');
      const userAvatar = document.getElementById('user-avatar');
      const userName = document.getElementById('user-name');
      
      if (!loginBtn) return;
      
      // 監聽登入狀態變化
      onAuthStateChanged(auth, (user) => {
          if (user) {
              // 用戶已登入
              console.log('已登入:', user.displayName);
              loginBtn.style.display = 'none';
              if (userProfile) userProfile.style.display = 'flex';
              if (userAvatar) userAvatar.src = user.photoURL || 'https://via.placeholder.com/40';
              if (userName) userName.textContent = user.displayName || '會員';
          } else {
              // 用戶未登入
              console.log('未登入');
              loginBtn.style.display = 'flex';
              if (userProfile) userProfile.style.display = 'none';
          }
      });
      
      // Google 登入按鈕
      loginBtn.addEventListener('click', async () => {
          try {
              loginBtn.disabled = true;
              loginBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
              
              // 設定 Google Provider 選項
              googleProvider.setCustomParameters({
                  prompt: 'select_account'
              });
              
              const result = await signInWithPopup(auth, googleProvider);
              console.log('登入成功:', result.user.displayName);
              
          } catch (error) {
              console.error('登入失敗:', error);
              console.error('錯誤代碼:', error.code);
              console.error('錯誤訊息:', error.message);
              
              // 處理常見錯誤
              if (error.code === 'auth/popup-closed-by-user') {
                  console.log('用戶取消登入');
              } else if (error.code === 'auth/popup-blocked') {
                  alert('請允許彈出視窗以完成登入');
              } else if (error.code === 'auth/unauthorized-domain') {
                  alert('⚠️ 此網域尚未授權！\n\n請到 Firebase Console → Authentication → Settings → Authorized domains\n添加此網域：' + window.location.hostname);
              } else if (error.code === 'auth/operation-not-allowed') {
                  alert('⚠️ Google 登入尚未啟用！\n\n請到 Firebase Console → Authentication → Sign-in method\n啟用 Google 登入');
              } else {
                  alert('登入失敗：' + (error.message || error.code));
              }
          } finally {
              loginBtn.disabled = false;
              loginBtn.innerHTML = '<i class="fa-brands fa-google"></i><span>登入</span>';
          }
      });
      
      // 登出按鈕
      if (logoutBtn) {
          logoutBtn.addEventListener('click', async () => {
              try {
                  await signOut(auth);
                  console.log('已登出');
              } catch (error) {
                  console.error('登出失敗:', error);
              }
          });
      }
  }
  
  // ===== URGENT ZONE COUNTDOWN =====
  function setupUrgentCountdown() {
      const countdownEl = document.getElementById('urgent-countdown');
      if (!countdownEl) return;
      
      // 設定目標時間 (今天午夜)
      const updateCountdown = () => {
          const now = new Date();
          const midnight = new Date();
          midnight.setHours(23, 59, 59, 999);
          
          const diff = midnight - now;
          
          if (diff <= 0) {
              countdownEl.textContent = '優惠已結束';
              return;
          }
          
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          
          countdownEl.textContent = `剩餘 ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      };
      
      updateCountdown();
      setInterval(updateCountdown, 1000);
  }
  
  // ===== INSIDER VAULT (CSV 獲取 + 每日採樣 + 緩存) =====
  function setupInsiderVault() {
      const CSV_URL = "https://docs.google.com/spreadsheets/d/1Vnvpz_B6FOXSPQFZPp9yDULEDel1_50CQj1sH2uDJnI/export?format=csv";
      const CACHE_KEY_PREFIX = "cardubi_vault_";
      const urgentCardsContainer = document.getElementById('urgent-cards');
      
      if (!urgentCardsContainer) {
          console.warn('找不到 #urgent-cards 容器');
          return;
      }
      
      // 更新倒數計時器文字為「今日精選」
      const countdownEl = document.getElementById('urgent-countdown');
      if (countdownEl) {
          countdownEl.textContent = '今日精選';
      }
      
      // 獲取今天的日期字串 (YYYY-MM-DD)
      function getTodayKey() {
          const now = new Date();
          return CACHE_KEY_PREFIX + now.toISOString().split('T')[0];
      }
      
      // 清理舊的緩存 (保留最近7天)
      function cleanupOldCache() {
          const today = new Date();
          const sevenDaysAgo = new Date(today);
          sevenDaysAgo.setDate(today.getDate() - 7);
          
          for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i);
              if (key.startsWith(CACHE_KEY_PREFIX)) {
                  const dateStr = key.replace(CACHE_KEY_PREFIX, '');
                  const cacheDate = new Date(dateStr);
                  if (cacheDate < sevenDaysAgo) {
                      localStorage.removeItem(key);
                  }
              }
          }
      }
      
      // 解析 CSV 行 (處理逗號和引號)
      function parseCSVRow(row) {
          const result = [];
          let current = '';
          let inQuotes = false;
          
          for (let i = 0; i < row.length; i++) {
              const char = row[i];
              const nextChar = row[i + 1];
              
              if (char === '"') {
                  if (inQuotes && nextChar === '"') {
                      current += '"';
                      i++; // 跳過下一個引號
                  } else {
                      inQuotes = !inQuotes;
                  }
              } else if (char === ',' && !inQuotes) {
                  result.push(current.trim());
                  current = '';
              } else {
                  current += char;
              }
          }
          
          result.push(current.trim());
          return result;
      }
      
      // 解析 CSV 數據
      function parseCSVData(csvText) {
          const lines = csvText.split('\n').filter(line => line.trim());
          if (lines.length < 2) return [];
          
          // 嘗試檢測標題行 (支援中英文別名)
          const headerLine = lines[0];
          const headers = parseCSVRow(headerLine);
          
          // 建立欄位映射
          const fieldMap = {
              bank: headers.findIndex(h => 
                  ['Bank', '銀行', 'bank', 'Bank Name', '銀行名稱'].includes(h.trim())
              ),
              appName: headers.findIndex(h => 
                  ['App Name', 'App名稱', 'app name', '應用名稱'].includes(h.trim())
              ),
              offerTitle: headers.findIndex(h => 
                  ['Offer Title', '優惠標題', 'offer title', 'Title', '標題'].includes(h.trim())
              ),
              endDate: headers.findIndex(h => 
                  ['End Date', '結束日期', 'end date', '截止日期'].includes(h.trim())
              ),
              hiddenNote: headers.findIndex(h => 
                  ['Hidden Note', '隱藏備註', 'hidden note', '備註'].includes(h.trim())
              )
          };
          
          // 解析數據行
          const offers = [];
          for (let i = 1; i < lines.length; i++) {
              const row = parseCSVRow(lines[i]);
              if (row.length < Math.max(...Object.values(fieldMap).filter(idx => idx !== -1))) {
                  continue; // 跳過不完整的行
              }
              
              const offer = {
                  bank: fieldMap.bank !== -1 ? row[fieldMap.bank] : '',
                  appName: fieldMap.appName !== -1 ? row[fieldMap.appName] : '',
                  offerTitle: fieldMap.offerTitle !== -1 ? row[fieldMap.offerTitle] : '',
                  endDate: fieldMap.endDate !== -1 ? row[fieldMap.endDate] : '',
                  hiddenNote: fieldMap.hiddenNote !== -1 ? row[fieldMap.hiddenNote] : ''
              };
              
              offers.push(offer);
          }
          
          return offers;
      }
      
      // 過濾已過期的優惠
      function filterExpiredOffers(offers) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          return offers.filter(offer => {
              if (!offer.endDate || offer.endDate.trim() === '') {
                  return true; // 沒有結束日期，保留
              }
              
              try {
                  // 嘗試解析各種日期格式
                  const dateStr = offer.endDate.trim();
                  let endDate;
                  
                  // 嘗試 YYYY/MM/DD 格式
                  if (dateStr.includes('/')) {
                      const parts = dateStr.split('/');
                      if (parts.length === 3) {
                          endDate = new Date(parts[0], parts[1] - 1, parts[2]);
                      }
                  }
                  
                  // 嘗試 YYYY-MM-DD 格式
                  if (!endDate && dateStr.includes('-')) {
                      endDate = new Date(dateStr);
                  }
                  
                  // 如果解析失敗，保留優惠 (fail-safe)
                  if (!endDate || isNaN(endDate.getTime())) {
                      return true;
                  }
                  
                  endDate.setHours(23, 59, 59, 999);
                  return endDate >= today;
              } catch (error) {
                  console.warn('日期解析失敗:', offer.endDate, error);
                  return true; // 解析失敗時保留
              }
          });
      }
      
      // 採樣邏輯：從最多4家不同銀行中各選1個優惠
      function sampleOffers(offers) {
          if (offers.length === 0) return [];
          
          // 按銀行分組
          const bankGroups = {};
          offers.forEach(offer => {
              const bank = offer.bank.trim();
              if (!bankGroups[bank]) {
                  bankGroups[bank] = [];
              }
              bankGroups[bank].push(offer);
          });
          
          // 獲取銀行列表並隨機排序
          const banks = Object.keys(bankGroups);
          const shuffledBanks = [...banks].sort(() => Math.random() - 0.5);
          
          // 從最多4家不同銀行中各選1個優惠
          const selectedOffers = [];
          const maxBanks = Math.min(4, shuffledBanks.length);
          
          for (let i = 0; i < maxBanks; i++) {
              const bank = shuffledBanks[i];
              const bankOffers = bankGroups[bank];
              if (bankOffers && bankOffers.length > 0) {
                  // 隨機選擇一個優惠
                  const randomIndex = Math.floor(Math.random() * bankOffers.length);
                  selectedOffers.push(bankOffers[randomIndex]);
              }
          }
          
          return selectedOffers;
      }
      
      // 渲染優惠卡片 (始終顯示4張卡片)
      function renderOffers(offers) {
          urgentCardsContainer.innerHTML = '';
          
          // 驗證卡片有效性：必須包含Bank、Offer Title、Hidden Note
          const validOffers = offers.filter(offer => 
              offer.bank && offer.bank.trim() && 
              offer.offerTitle && offer.offerTitle.trim() && 
              offer.hiddenNote && offer.hiddenNote.trim()
          );
          
          // 始終顯示4張卡片，不足時添加占位符
          const totalCards = 4;
          const validCount = Math.min(validOffers.length, totalCards);
          
          // 渲染有效卡片
          for (let i = 0; i < validCount; i++) {
              const offer = validOffers[i];
              createOfferCard(offer, i, false);
          }
          
          // 添加占位符卡片
          for (let i = validCount; i < totalCards; i++) {
              createPlaceholderCard(i);
          }
          
          // 如果沒有任何有效卡片，顯示訊息
          if (validOffers.length === 0) {
              const message = document.createElement('div');
              message.className = 'vault-message';
              message.innerHTML = `
                  <div class="vault-empty">
                      <i class="fas fa-box-open"></i>
                      <p>本週精選不足 4 家，持續補貨中</p>
                  </div>
              `;
              urgentCardsContainer.appendChild(message);
          }
      }
      
      // 創建有效優惠卡片
      function createOfferCard(offer, index, isPlaceholder = false) {
          const card = document.createElement('div');
          card.className = 'urgent-card vault-card locked';
          card.dataset.index = index;
          card.dataset.isPlaceholder = isPlaceholder;
          card.tabIndex = 0; // 讓卡片可聚焦，支援鍵盤操作
          
          // 格式化結束日期
          let formattedDate = offer.endDate;
          try {
              const date = new Date(offer.endDate);
              if (!isNaN(date.getTime())) {
                  formattedDate = date.toLocaleDateString('zh-TW', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                  });
              }
          } catch (e) {
              // 保持原格式
          }
          
          card.innerHTML = `
              <div class="vault-card-inner">
                  <div class="vault-card-front">
                      <div class="vault-card-header">
                          <span class="exclusive-tag">全網獨家</span>
                          <span class="lock-icon">🔒</span>
                      </div>
                      <div class="vault-card-content">
                          <div class="bank-logo-placeholder">
                              <i class="fas fa-university"></i>
                          </div>
                          <h4 class="vault-card-title">隱藏優惠</h4>
                          <p class="vault-card-subtitle">點擊解鎖查看詳情</p>
                          <div class="unlock-hint">
                              <span class="unlock-icon">🔓</span>
                              <span>點擊解鎖</span>
                          </div>
                      </div>
                      <div class="vault-card-footer">
                          <span class="bank-name">${offer.bank || '未知銀行'}</span>
                      </div>
                  </div>
                  <div class="vault-card-back">
                      <div class="vault-card-header">
                          <span class="exclusive-tag">全網獨家</span>
                          <span class="unlocked-icon">🔓</span>
                      </div>
                      <div class="vault-card-details">
                          <h4 class="offer-title">${offer.offerTitle || '未命名優惠'}</h4>
                          <div class="offer-meta">
                              <div class="meta-item">
                                  <i class="fas fa-mobile-alt"></i>
                                  <span>${offer.appName || '銀行App'}</span>
                              </div>
                              <div class="meta-item">
                                  <i class="fas fa-calendar-alt"></i>
                                  <span>${formattedDate}</span>
                              </div>
                          </div>
                          <div class="hidden-note">
                              <i class="fas fa-sticky-note"></i>
                              <p>${offer.hiddenNote || '無備註'}</p>
                          </div>
                      </div>
                      <div class="vault-card-footer">
                          <span class="bank-name">${offer.bank || '未知銀行'}</span>
                          <button class="lock-again-btn" aria-label="重新鎖定">
                              <i class="fas fa-lock"></i>
                          </button>
                      </div>
                  </div>
              </div>
              <div class="vault-blur-overlay"></div>
          `;
          
          urgentCardsContainer.appendChild(card);
          
          // 綁定點擊事件 (解鎖/鎖定)
          const lockAgainBtn = card.querySelector('.lock-again-btn');
          
          const unlockCard = () => {
              card.classList.remove('locked');
              card.classList.add('unlocked');
              card.setAttribute('aria-label', `已解鎖：${offer.offerTitle}`);
          };
          
          const lockCard = () => {
              card.classList.remove('unlocked');
              card.classList.add('locked');
              card.setAttribute('aria-label', `已鎖定：${offer.bank}隱藏優惠`);
          };
          
          // 點擊卡片解鎖
          card.addEventListener('click', (e) => {
              if (e.target.closest('.lock-again-btn')) return; // 避免事件冒泡
              unlockCard();
          });
          
          // 按鍵盤 Enter/Space 解鎖
          card.addEventListener('keydown', (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  unlockCard();
              }
          });
          
          // 點擊鎖定按鈕重新鎖定
          if (lockAgainBtn) {
              lockAgainBtn.addEventListener('click', (e) => {
                  e.stopPropagation();
                  lockCard();
              });
          }
      }
      
      // 創建占位符卡片
      function createPlaceholderCard(index) {
          const card = document.createElement('div');
          card.className = 'urgent-card vault-card placeholder locked';
          card.dataset.index = index;
          card.dataset.isPlaceholder = true;
          card.tabIndex = 0;
          
          card.innerHTML = `
              <div class="vault-card-inner">
                  <div class="vault-card-front">
                      <div class="vault-card-header">
                          <span class="placeholder-tag">資料補貨中</span>
                          <span class="lock-icon">🔒</span>
                      </div>
                      <div class="vault-card-content">
                          <div class="bank-logo-placeholder placeholder">
                              <i class="fas fa-clock"></i>
                          </div>
                          <h4 class="vault-card-title">即將上線</h4>
                          <p class="vault-card-subtitle">人工蒐集中</p>
                          <div class="unlock-hint">
                              <span class="unlock-icon">⏳</span>
                              <span>敬請期待</span>
                          </div>
                      </div>
                      <div class="vault-card-footer">
                          <span class="bank-name">銀行名稱</span>
                      </div>
                  </div>
                  <div class="vault-card-back">
                      <div class="vault-card-header">
                          <span class="placeholder-tag">資料補貨中</span>
                          <span class="unlocked-icon">🔒</span>
                      </div>
                      <div class="vault-card-details">
                          <h4 class="offer-title">優惠標題</h4>
                          <div class="offer-meta">
                              <div class="meta-item">
                                  <i class="fas fa-mobile-alt"></i>
                                  <span>銀行App</span>
                              </div>
                              <div class="meta-item">
                                  <i class="fas fa-calendar-alt"></i>
                                  <span>結束日期</span>
                              </div>
                          </div>
                          <div class="hidden-note">
                              <i class="fas fa-sticky-note"></i>
                              <p>隱藏備註</p>
                          </div>
                      </div>
                      <div class="vault-card-footer">
                          <span class="bank-name">銀行名稱</span>
                          <button class="lock-again-btn" aria-label="重新鎖定" disabled>
                              <i class="fas fa-lock"></i>
                          </button>
                      </div>
                  </div>
              </div>
              <div class="vault-blur-overlay"></div>
          `;
          
          urgentCardsContainer.appendChild(card);
          
          // 占位符卡片不可解鎖
          card.addEventListener('click', (e) => {
              e.preventDefault();
              card.classList.add('placeholder-pulse');
              setTimeout(() => card.classList.remove('placeholder-pulse'), 300);
          });
          
          card.addEventListener('keydown', (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  card.classList.add('placeholder-pulse');
                  setTimeout(() => card.classList.remove('placeholder-pulse'), 300);
              }
          });
      }
      
      // 主執行函數
      async function executeVaultLogic() {
          cleanupOldCache();
          
          const todayKey = getTodayKey();
          const cachedData = localStorage.getItem(todayKey);
          
          if (cachedData) {
              // 使用緩存的選擇
              try {
                  const cachedOffers = JSON.parse(cachedData);
                  console.log('使用緩存的 Insider Vault 選擇');
                  renderOffers(cachedOffers);
                  return;
              } catch (e) {
                  console.warn('緩存解析失敗，重新獲取數據', e);
              }
          }
          
          // 沒有緩存或緩存無效，重新獲取數據
          try {
              console.log('獲取 CSV 數據...');
              const response = await fetch(CSV_URL);
              
              if (!response.ok) {
                  throw new Error(`HTTP ${response.status}: ${response.statusText}`);
              }
              
              const csvText = await response.text();
              const allOffers = parseCSVData(csvText);
              
              if (allOffers.length === 0) {
                  throw new Error('CSV 數據為空或解析失敗');
              }
              
              console.log(`成功解析 ${allOffers.length} 個優惠`);
              
              // 過濾和採樣
              const validOffers = filterExpiredOffers(allOffers);
              console.log(`過濾後剩餘 ${validOffers.length} 個有效優惠`);
              
              const sampledOffers = sampleOffers(validOffers);
              console.log(`採樣選擇 ${sampledOffers.length} 個優惠`);
              
              // 緩存今天的選擇
              localStorage.setItem(todayKey, JSON.stringify(sampledOffers));
              
              // 渲染卡片
              renderOffers(sampledOffers);
              
          } catch (error) {
              console.error('Insider Vault 錯誤:', error);
              
              // 顯示錯誤訊息
              urgentCardsContainer.innerHTML = `
                  <div class="vault-error">
                      <i class="fas fa-exclamation-triangle"></i>
                      <p>暫時無法載入精選優惠</p>
                      <p class="error-detail">${error.message}</p>
                      <button class="retry-btn" onclick="setupInsiderVault()">重試</button>
                  </div>
              `;
          }
      }
      
      // 初始化
      executeVaultLogic();
  }
  
  // ===== APPLE 風格現金回饋計算器 =====
  function setupCashbackCalculator() {
      const calculatorZone = document.querySelector('.calculator-zone');
      if (!calculatorZone) return;
      
      const amountSlider = document.getElementById('cashback-slider');
      const amountValue = document.getElementById('cashback-amount');
      const cashbackDisplay = document.getElementById('cashback-result');
      const rateDisplay = document.getElementById('cashback-rate');
      
      if (!amountSlider || !amountValue || !cashbackDisplay || !rateDisplay) {
          console.warn('計算器元素未找到');
          return;
      }
      
      const FIXED_RATE = 3.5; // 固定利率 3.5%
      const MAX_AMOUNT = 100000; // 最大金額 100,000 TWD
      
      // 更新利率顯示
      rateDisplay.textContent = `${FIXED_RATE}%`;
      
      // 平滑計數動畫函數
      function animateValue(element, start, end, duration = 800) {
          if (start === end) return;
          
          const range = end - start;
          const startTime = performance.now();
          const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
          
          function update(currentTime) {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const eased = easeOutQuart(progress);
              const current = Math.floor(start + range * eased);
              
              element.textContent = current.toLocaleString('zh-TW');
              
              if (progress < 1) {
                  requestAnimationFrame(update);
              }
          }
          
          requestAnimationFrame(update);
      }
      
      // 計算現金回饋
      function calculateCashback(amount) {
          return Math.floor(amount * (FIXED_RATE / 100));
      }
      
      // 更新顯示
      function updateDisplay(amount) {
          // 更新金額顯示
          amountValue.textContent = amount.toLocaleString('zh-TW');
          
          // 計算現金回饋
          const cashback = calculateCashback(amount);
          
          // 動畫更新現金回饋顯示
          const currentCashback = parseInt(cashbackDisplay.textContent.replace(/,/g, '') || 0);
          animateValue(cashbackDisplay, currentCashback, cashback);
          
          // 更新滑桿背景 (視覺回饋)
          const percentage = (amount / MAX_AMOUNT) * 100;
          amountSlider.style.background = `
              linear-gradient(to right, 
                  #007AFF 0%, 
                  #007AFF ${percentage}%, 
                  rgba(255, 255, 255, 0.1) ${percentage}%, 
                  rgba(255, 255, 255, 0.1) 100%
              )
          `;
      }
      
      // 初始化
      const initialAmount = parseInt(amountSlider.value) || 50000;
      updateDisplay(initialAmount);
      
      // 滑桿輸入事件
      amountSlider.addEventListener('input', (e) => {
          const amount = parseInt(e.target.value);
          updateDisplay(amount);
      });
      
      // 鍵盤導航支援
      amountSlider.addEventListener('keydown', (e) => {
          let step = 1000;
          
          switch(e.key) {
              case 'ArrowUp':
              case 'ArrowRight':
                  e.preventDefault();
                  amountSlider.value = Math.min(parseInt(amountSlider.value) + step, MAX_AMOUNT);
                  updateDisplay(parseInt(amountSlider.value));
                  break;
                  
              case 'ArrowDown':
              case 'ArrowLeft':
                  e.preventDefault();
                  amountSlider.value = Math.max(parseInt(amountSlider.value) - step, 0);
                  updateDisplay(parseInt(amountSlider.value));
                  break;
                  
              case 'Home':
                  e.preventDefault();
                  amountSlider.value = 0;
                  updateDisplay(0);
                  break;
                  
              case 'End':
                  e.preventDefault();
                  amountSlider.value = MAX_AMOUNT;
                  updateDisplay(MAX_AMOUNT);
                  break;
          }
      });
      
      // 觸控裝置優化
      amountSlider.addEventListener('touchstart', () => {
          amountSlider.style.cursor = 'grabbing';
      });
      
      amountSlider.addEventListener('touchend', () => {
          amountSlider.style.cursor = 'grab';
      });
  }
  
  // ===== AI 每週內容網格 =====
  function setupContentHub() {
      const contentHub = document.querySelector('.content-hub');
      if (!contentHub) return;
      
      const contentGrid = contentHub.querySelector('.content-grid-hub');
      if (!contentGrid) return;
      
      // 模擬 AI 每週內容數據 (僅3篇靜態文章)
      const aiWeeklyContent = [
          {
              id: 1,
              title: "2025 信用卡現金回饋趨勢分析",
              excerpt: "AI 深度分析顯示，數位銀行將主導未來現金回饋市場，傳統銀行需加速轉型。",
              category: "趨勢分析",
              readTime: "5 分鐘",
              date: "2025-12-26",
              imageColor: "#4A90E2",
              icon: "fas fa-chart-line"
          },
          {
              id: 2,
              title: "隱藏版優惠：銀行 App 獨家活動解密",
              excerpt: "我們發現超過 60% 的高回饋優惠僅在銀行 App 內顯示，外部網站完全搜尋不到。",
              category: "獨家調查",
              readTime: "7 分鐘",
              date: "2025-12-25",
              imageColor: "#50C878",
              icon: "fas fa-mobile-alt"
          },
          {
              id: 3,
              title: "週末消費攻略：最高 10% 回饋組合",
              excerpt: "本週末精選消費組合，透過特定支付方式疊加優惠，最高可達 10% 現金回饋。",
              category: "消費攻略",
              readTime: "4 分鐘",
              date: "2025-12-24",
              imageColor: "#FF6B6B",
              icon: "fas fa-shopping-bag"
          }
      ];
      
      // 渲染內容卡片
      function renderContentCards() {
          contentGrid.innerHTML = '';
          
          aiWeeklyContent.forEach(item => {
              const card = document.createElement('article');
              card.className = 'content-card';
              card.tabIndex = 0;
              card.setAttribute('aria-label', `${item.title} - ${item.category}`);
              
              // 格式化日期
              const formattedDate = new Date(item.date).toLocaleDateString('zh-TW', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
              });
              
              card.innerHTML = `
                  <div class="content-card-image" style="background-color: ${item.imageColor}">
                      <i class="${item.icon}"></i>
                  </div>
                  <div class="content-card-content">
                      <div class="content-card-header">
                          <span class="content-category">${item.category}</span>
                          <span class="content-read-time">
                              <i class="far fa-clock"></i>
                              ${item.readTime}
                          </span>
                      </div>
                      <h3 class="content-title">${item.title}</h3>
                      <p class="content-excerpt">${item.excerpt}</p>
                      <div class="content-card-footer">
                          <span class="content-date">
                              <i class="far fa-calendar"></i>
                              ${formattedDate}
                          </span>
                          <button class="content-read-btn" aria-label="閱讀全文：${item.title}">
                              閱讀全文
                              <i class="fas fa-arrow-right"></i>
                          </button>
                      </div>
                  </div>
              `;
              
              contentGrid.appendChild(card);
              
              // 綁定點擊事件
              const readBtn = card.querySelector('.content-read-btn');
              readBtn.addEventListener('click', () => {
                  alert(`即將開啟「${item.title}」的詳細內容`);
                  // 實際應用中這裡會導向文章頁面
              });
              
              // 鍵盤支援
              card.addEventListener('keydown', (e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      readBtn.click();
                  }
              });
          });
      }
      
      // 響應式網格調整
      function updateGridColumns() {
          const width = window.innerWidth;
          let columns = 1;
          
          if (width >= 1024) {
              columns = 3;
          } else if (width >= 768) {
              columns = 2;
          }
          
          contentGrid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
      }
      
      // 初始化
      renderContentCards();
      updateGridColumns();
      
      // 監聽視窗大小變化
      window.addEventListener('resize', updateGridColumns);
      
      // 添加滾動動畫
      const observerOptions = {
          root: null,
          rootMargin: '0px',
          threshold: 0.1
      };
      
      const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              if (entry.isIntersecting) {
                  entry.target.classList.add('visible');
              }
          });
      }, observerOptions);
      
      document.querySelectorAll('.content-card').forEach(card => {
          observer.observe(card);
      });
  }
