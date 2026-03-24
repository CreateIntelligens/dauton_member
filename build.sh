#!/bin/bash

echo "======================================"
echo "  📦 開始打包大同會員系統"
echo "======================================"
echo ""

# 清除舊的 dist
echo "🗑️  清除舊的 dist 目錄..."
rm -rf dist
echo ""

# 建立 dist 目錄結構（加入 tatung_member_login 層級）
echo "📁 建立目錄結構..."
mkdir -p dist/tatung_member_login/assets/js/pages
mkdir -p dist/tatung_member_login/assets/css
mkdir -p dist/tatung_member_login/assets/images
echo ""

# 生成哈希函數
generate_hash() {
  local file=$1
  if [ -f "$file" ]; then
    # 使用 md5 生成 8 位哈希
    if command -v md5sum &> /dev/null; then
      echo $(md5sum "$file" | cut -c1-8)
    elif command -v md5 &> /dev/null; then
      echo $(md5 -q "$file" | cut -c1-8)
    else
      # 如果沒有 md5 工具，使用時間戳
      echo $(date +%s | tail -c 9 | head -c 8)
    fi
  fi
}

echo ""

# 複製 HTML
echo "📄 複製 HTML 檔案..."
cp index.html dist/
echo ""

# 複製 CSS
echo "🎨 複製 CSS 檔案..."
cp css/style.css dist/tatung_member_login/assets/css/
echo ""

# 複製 JS 檔案
echo "📜 複製 JavaScript 檔案..."
cp js/api.js dist/tatung_member_login/assets/js/
cp js/router.js dist/tatung_member_login/assets/js/
cp js/app.js dist/tatung_member_login/assets/js/
cp -r js/pages/*.js dist/tatung_member_login/assets/js/pages/
echo ""

# 複製 assets
echo "🖼️  複製圖片資源..."
if [ -d "assets" ]; then
  cp -r assets/* dist/tatung_member_login/assets/images/
fi
echo ""

# 檢查是否安裝 uglify-js (用於壓縮 JS)
if command -v uglifyjs &> /dev/null; then
  echo "🔧 壓縮 JavaScript 檔案..."

  # 壓縮主要 JS 檔案並添加哈希
  uglifyjs dist/tatung_member_login/assets/js/api.js -c -m -o dist/tatung_member_login/assets/js/api.min.js
  hash_api=$(generate_hash dist/tatung_member_login/assets/js/api.min.js)
  mv dist/tatung_member_login/assets/js/api.min.js dist/tatung_member_login/assets/js/api.$hash_api.js
  rm dist/tatung_member_login/assets/js/api.js

  uglifyjs dist/tatung_member_login/assets/js/router.js -c -m -o dist/tatung_member_login/assets/js/router.min.js
  hash_router=$(generate_hash dist/tatung_member_login/assets/js/router.min.js)
  mv dist/tatung_member_login/assets/js/router.min.js dist/tatung_member_login/assets/js/router.$hash_router.js
  rm dist/tatung_member_login/assets/js/router.js

  uglifyjs dist/tatung_member_login/assets/js/app.js -c -m -o dist/tatung_member_login/assets/js/app.min.js
  hash_app=$(generate_hash dist/tatung_member_login/assets/js/app.min.js)
  mv dist/tatung_member_login/assets/js/app.min.js dist/tatung_member_login/assets/js/app.$hash_app.js
  rm dist/tatung_member_login/assets/js/app.js

  # 壓縮頁面 JS 檔案並添加哈希
  for file in dist/tatung_member_login/assets/js/pages/*.js; do
    filename=$(basename "$file" .js)
    uglifyjs "$file" -c -m -o "${file%.js}.min.js"
    hash=$(generate_hash "${file%.js}.min.js")
    mv "${file%.js}.min.js" "dist/tatung_member_login/assets/js/pages/$filename.$hash.js"
    rm "$file"
  done

  echo "✅ JavaScript 壓縮完成"
else
  echo "⚠️  未安裝 uglify-js，跳過 JS 壓縮"
  echo "   安裝方式: npm install -g uglify-js"

  # 沒有壓縮工具時，至少添加哈希
  for file in dist/tatung_member_login/assets/js/*.js; do
    if [ -f "$file" ]; then
      filename=$(basename "$file" .js)
      hash=$(generate_hash "$file")
      mv "$file" "dist/tatung_member_login/assets/js/$filename.$hash.js"
    fi
  done
  for file in dist/tatung_member_login/assets/js/pages/*.js; do
    if [ -f "$file" ]; then
      filename=$(basename "$file" .js)
      hash=$(generate_hash "$file")
      mv "$file" "dist/tatung_member_login/assets/js/pages/$filename.$hash.js"
    fi
  done
fi
echo ""

# 檢查是否安裝 csso-cli (用於壓縮 CSS)
if command -v csso &> /dev/null; then
  echo "🔧 壓縮 CSS 檔案..."
  csso dist/tatung_member_login/assets/css/style.css -o dist/tatung_member_login/assets/css/style.min.css
  hash_css=$(generate_hash dist/tatung_member_login/assets/css/style.min.css)
  mv dist/tatung_member_login/assets/css/style.min.css dist/tatung_member_login/assets/css/style.$hash_css.css
  rm dist/tatung_member_login/assets/css/style.css
  echo "✅ CSS 壓縮完成"
else
  echo "⚠️  未安裝 csso-cli，跳過 CSS 壓縮"
  echo "   安裝方式: npm install -g csso-cli"

  # 沒有壓縮工具時，至少添加哈希
  hash_css=$(generate_hash dist/tatung_member_login/assets/css/style.css)
  mv dist/tatung_member_login/assets/css/style.css dist/tatung_member_login/assets/css/style.$hash_css.css
fi
echo ""

# 更新 HTML 中的路徑
echo "🔄 更新 HTML 檔案中的資源路徑..."

# 替換 CSS 路徑
sed -i.bak "s|href=\"css/style.css\"|href=\"tatung_member_login/assets/css/style.$hash_css.css\"|g" dist/index.html

# 替換主要 JS 路徑
sed -i.bak "s|src=\"js/api.js\"|src=\"tatung_member_login/assets/js/api.$hash_api.js\"|g" dist/index.html
sed -i.bak "s|src=\"js/router.js\"|src=\"tatung_member_login/assets/js/router.$hash_router.js\"|g" dist/index.html
sed -i.bak "s|src=\"js/app.js\"|src=\"tatung_member_login/assets/js/app.$hash_app.js\"|g" dist/index.html

# 替換 pages JS 路徑（動態處理每個檔案）
for file in dist/tatung_member_login/assets/js/pages/*.js; do
  filename=$(basename "$file")
  original_name=$(echo "$filename" | sed 's/\.[^.]*\.js$/.js/')
  sed -i.bak "s|src=\"js/pages/$original_name\"|src=\"tatung_member_login/assets/js/pages/$filename\"|g" dist/index.html
done

# 替換圖片路徑
sed -i.bak "s|src=\"assets/|src=\"tatung_member_login/assets/images/|g" dist/index.html

# 清理備份檔案
rm -f dist/index.html.bak

echo "✅ HTML 路徑更新完成"
echo ""

# 計算檔案大小
echo "📊 打包結果:"
echo "---"
du -sh dist
echo "---"
echo ""

echo "======================================"
echo "  ✅ 打包完成!"
echo "======================================"
echo ""
echo "  📂 輸出目錄: dist/"
echo "  🌐 部署檔案: dist/index.html"
echo ""
echo "測試打包結果:"
echo "  cd dist && python3 -m http.server 8002"
echo ""
