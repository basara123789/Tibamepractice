const https = require('https');

exports.handler = async function(event, context) {
  console.log("Chat function triggered (Groq / llama-3.3-70b-versatile)");

  // 1. 只允許 POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  // 2. 讀取 API Key（優先 Groq，備用 Gemini）
  const groqKey = (process.env.GROQ_API_KEY || "").trim();
  const geminiKey = (process.env.GEMINI_API_KEY || "").trim();

  if (!groqKey && !geminiKey) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: 'API Key 未設定，請在 Netlify 設定 GROQ_API_KEY 或 GEMINI_API_KEY'
      })
    };
  }

  // 3. 解析使用者輸入
  let prompt;
  try {
    const body = JSON.parse(event.body || "{}");
    prompt = body.prompt;
  } catch (e) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: 'Invalid JSON' })
    };
  }

  if (!prompt) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: 'prompt 不可為空' })
    };
  }

  // 4. 決定使用哪個 API
  if (groqKey) {
    // ⭐ 使用 Groq API (Llama 3.3 70B - 免費且超快)
    return callGroqAPI(groqKey, prompt);
  } else {
    // 備用：使用 Gemini API
    return callGeminiAPI(geminiKey, prompt);
  }
};

// ===== Groq API (OpenAI 相容格式) =====
async function callGroqAPI(apiKey, prompt) {
  const postData = JSON.stringify({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: "你是一個專業的信用卡理財顧問。回答請簡潔有力，條列重點即可。使用繁體中文回答。"
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 1024
  });

  const options = {
    hostname: 'api.groq.com',
    path: '/openai/v1/chat/completions',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  return new Promise((resolve) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);

      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          
          if (res.statusCode >= 200 && res.statusCode < 300 && json.choices) {
            // 成功：轉換成前端期望的格式
            const replyText = json.choices[0]?.message?.content || "AI 沒有回覆";
            resolve({
              statusCode: 200,
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ reply: replyText })
            });
          } else {
            console.error("Groq API Error:", res.statusCode, data);
            resolve({
              statusCode: 500,
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ error: json.error?.message || "Groq API 錯誤" })
            });
          }
        } catch (e) {
          resolve({
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: "解析回應失敗: " + e.message })
          });
        }
      });
    });

    req.on('error', (e) => {
      console.error("Request Error:", e);
      resolve({
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "連線錯誤: " + e.message })
      });
    });

    req.write(postData);
    req.end();
  });
}

// ===== Gemini API (備用) =====
async function callGeminiAPI(apiKey, prompt) {
  const postData = JSON.stringify({
    contents: [{
      parts: [{
        text: "你是一個專業的信用卡理財顧問。回答請簡潔有力，條列重點即可。\n\n使用者問：" + prompt
      }]
    }]
  });

  const options = {
    hostname: 'generativelanguage.googleapis.com',
    path: `/v1/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  return new Promise((resolve) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);

      res.on('end', () => {
        const statusCode = (res.statusCode >= 200 && res.statusCode < 300) ? 200 : 500;

        if (statusCode !== 200) {
          console.error("Gemini API Error:", res.statusCode, data);
        }

        resolve({
          statusCode,
          headers: { "Content-Type": "application/json" },
          body: data || JSON.stringify({ error: 'Empty response from Gemini API' })
        });
      });
    });

    req.on('error', (e) => {
      console.error("Request Error:", e);
      resolve({
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "連線錯誤: " + e.message })
      });
    });

    req.write(postData);
    req.end();
  });
}