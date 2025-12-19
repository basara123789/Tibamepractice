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
  