#!/bin/bash

# 大同會員系統開發環境啟動腳本

echo "======================================"
echo "  🚀 啟動大同會員開發環境"
echo "======================================"
echo ""

# 檢查是否有 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 錯誤：未安裝 Node.js"
    echo "請先安裝 Node.js: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js 版本: $(node --version)"
echo ""

# 啟動 CORS Proxy Server
echo "📡 啟動 CORS Proxy Server (Port 3001)..."
node proxy-server.js &
PROXY_PID=$!

# 等待 Proxy 啟動
sleep 2

# 啟動靜態檔案伺服器
echo "📁 啟動靜態檔案伺服器 (Port 8001)..."
python3 -m http.server 8001 &
HTTP_PID=$!

# 等待伺服器啟動
sleep 2

echo ""
echo "======================================"
echo "  ✅ 開發環境已啟動"
echo "======================================"
echo ""
echo "  📱 應用程式: http://localhost:8001/index-dev.html"
echo "  🔧 測試工具: http://localhost:8001/test-api.html"
echo "  📡 Proxy 伺服器: http://localhost:3001"
echo ""
echo "======================================"
echo "  按 Ctrl+C 停止伺服器"
echo "======================================"
echo ""

# 等待使用者中斷
trap "echo ''; echo '🛑 停止伺服器...'; kill $PROXY_PID $HTTP_PID; echo '✅ 已停止'; exit 0" INT

# 保持腳本運行
wait
