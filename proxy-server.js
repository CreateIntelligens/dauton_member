/* ============================================
   CORS Proxy Server
   用於開發環境繞過 CORS 限制
   ============================================ */

const http = require('http');
const https = require('https');
const url = require('url');

const TARGET_API = 'https://tatungssodev.azurewebsites.net';
const PORT = 3001;

const server = http.createServer((req, res) => {
  // 允許所有來源的 CORS 請求
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // 處理 OPTIONS 預檢請求
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // 解析請求路徑
  const parsedUrl = url.parse(req.url);
  const targetUrl = `${TARGET_API}${parsedUrl.path}`;

  console.log(`\n📡 Proxy Request: ${req.method} ${targetUrl}`);

  // 準備代理請求選項
  const options = {
    method: req.method,
    headers: {},
  };

  // 複製原始請求的 headers（除了 host）
  Object.keys(req.headers).forEach(key => {
    if (key.toLowerCase() !== 'host') {
      options.headers[key] = req.headers[key];
    }
  });

  // 發送代理請求
  const proxyReq = https.request(targetUrl, options, (proxyRes) => {
    console.log(`✅ Response Status: ${proxyRes.statusCode}`);

    // 複製回應 headers
    Object.keys(proxyRes.headers).forEach(key => {
      res.setHeader(key, proxyRes.headers[key]);
    });

    // 確保有 CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.writeHead(proxyRes.statusCode);

    // 轉發回應內容
    proxyRes.pipe(res);
  });

  // 錯誤處理
  proxyReq.on('error', (err) => {
    console.error('❌ Proxy Error:', err.message);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message }));
  });

  // 轉發請求 body
  req.pipe(proxyReq);
});

server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🚀 CORS Proxy Server 已啟動                              ║
║                                                            ║
║   本地代理: http://localhost:${PORT}                       ║
║   目標 API: ${TARGET_API}       ║
║                                                            ║
║   請將前端的 API_CONFIG.BASE_URL 改為:                      ║
║   BASE_URL: 'http://localhost:${PORT}'                     ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});
