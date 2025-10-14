# 🧪 Chain-Split App 測試指南

> **最後更新**: 2025-10-14
> **測試環境**: React Native + Expo

---

## 📋 測試前準備

### 1. 確認環境
確保你在正確的目錄：
```bash
cd /home/kim/Chain-Split/dapp
```

### 2. 檢查依賴
確認 node_modules 已安裝：
```bash
# 如果還沒安裝，執行：
npm install
```

---

## 🚀 方法 1: 使用 Expo Go (推薦 - 最快速)

### 步驟 1: 安裝 Expo Go App
在你的手機上安裝 Expo Go：
- **Android**: [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **iOS**: [App Store](https://apps.apple.com/app/expo-go/id982107779)

### 步驟 2: 啟動開發服務器
```bash
npm start
# 或
expo start --tunnel
```

**預期輸出**：
```
› Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press r │ reload app
› Press m │ toggle menu
› Press ? │ show all commands
```

### 步驟 3: 掃描 QR Code
1. **Android**: 打開 Expo Go，點擊 "Scan QR Code"
2. **iOS**: 打開相機 App，直接掃描 QR Code

### 步驟 4: 觀察應用啟動
- ✅ 看到 Welcome 頁面（💰 Logo + 進度條）
- ✅ 進度條動畫 (2.5秒)
- ✅ 自動跳轉到主頁面
- ✅ 看到 "Welcome!" 和 "Get Started" 按鈕

### 步驟 5: 測試交互
- 點擊 **"Get Started"** 按鈕
- 搖晃手機打開 Expo Dev Menu
- 選擇 "Debug Remote JS"
- 在瀏覽器 Console 中看到: `Welcome button pressed`

---

## 🖥️ 方法 2: 使用 Android 模擬器

### 前提條件
- 已安裝 Android Studio
- 已配置 Android 模擬器（AVD）

### 步驟 1: 啟動模擬器
```bash
# 列出可用的模擬器
emulator -list-avds

# 啟動模擬器（替換 YOUR_AVD_NAME）
emulator -avd YOUR_AVD_NAME
```

### 步驟 2: 啟動應用
```bash
npm run android
# 或
expo start --android
```

**Expo 會自動**：
1. 在模擬器上安裝 Expo Go
2. 啟動你的應用

---

## 🍎 方法 3: 使用 iOS 模擬器 (僅限 Mac)

### 前提條件
- 已安裝 Xcode
- 已配置 iOS 模擬器

### 啟動應用
```bash
npm run ios
# 或
expo start --ios
```

---

## 🌐 方法 4: 在瀏覽器測試 (快速預覽)

### 啟動 Web 版本
```bash
npm run web
# 或
expo start --web
```

**注意**: Web 版本可能與手機版本有些差異，建議用於快速預覽。

瀏覽器會自動打開 `http://localhost:8081` 或類似地址。

---

## 🔍 測試檢查清單

### Welcome 頁面 (Screen 1)
- [ ] Logo 顯示正確（💰 在金色圓圈內）
- [ ] 應用名稱 "Chain Split" 顯示清晰
- [ ] 標語 "Smart Group Payment" 顯示
- [ ] 進度條從左到右流暢動畫
- [ ] "Loading..." 文字顯示
- [ ] 2.5秒後自動跳轉

### Home 頁面 (Screen 2)
- [ ] Header 顯示 "Chain Split" 和 Logo
- [ ] "Welcome!" 標題居中
- [ ] "Ready to manage your group expenses" 副標題顯示
- [ ] "Get Started" 按鈕顯示（金色背景）
- [ ] 3張 Info Card 正確顯示：
  - [ ] 👥 Create Groups
  - [ ] 💳 Track Payments
  - [ ] ⚡ Instant Settlement
- [ ] Footer 顯示 "Powered by Solana Blockchain"
- [ ] 點擊按鈕時 Console 輸出正確

### 交互測試
- [ ] 按鈕點擊有視覺反饋（變暗效果）
- [ ] 頁面滾動流暢（如果內容超出螢幕）
- [ ] 沒有崩潰或錯誤訊息

---

## 🐛 常見問題排解

### 問題 1: `npm start` 失敗

**錯誤訊息**: `Cannot find module ...`

**解決方法**:
```bash
# 清除緩存並重新安裝
rm -rf node_modules package-lock.json
npm install
npm start
```

---

### 問題 2: Metro Bundler 錯誤

**錯誤訊息**: `Metro Bundler error: Unable to resolve module...`

**解決方法**:
```bash
# 清除 Metro 緩存
npx expo start --clear
```

---

### 問題 3: QR Code 掃描後無法連接

**可能原因**: 手機和電腦不在同一網絡

**解決方法 A - 使用 Tunnel 模式**:
```bash
expo start --tunnel
```

**解決方法 B - 檢查防火牆**:
確保防火牆允許 Expo 連接（端口 19000, 19001）

---

### 問題 4: 頁面無法跳轉

**症狀**: 停留在 Welcome 頁面

**檢查**:
```bash
# 查看 Console 錯誤
# 在 Expo Dev Menu 中選擇 "Debug Remote JS"
# 在瀏覽器 Console 查看錯誤
```

**可能原因**: 路由配置問題

**檢查文件**:
- `app/_layout.js` 是否正確
- `app/index.js` 是否正確
- `app/welcome.js` 和 `app/home.js` 是否存在

---

### 問題 5: 樣式顯示不正確

**檢查**:
```bash
# 確認 constants/theme.js 是否正確導出
cat constants/theme.js
```

**驗證導出**:
```javascript
// 應該包含:
export { COLORS, FONTS, SIZES };
```

---

## 📱 查看 Console 日誌

### 在 Expo Go 中
1. 搖晃手機打開 Dev Menu
2. 點擊 "Debug Remote JS"
3. 瀏覽器會自動打開 `http://localhost:19000/debugger-ui/`
4. 打開瀏覽器的 Developer Tools (F12)
5. 查看 Console 標籤

### 在終端中
```bash
# 啟動時添加 --verbose 查看詳細日誌
expo start --verbose
```

---

## 🔄 重新加載應用

### 方法 1: 使用快捷鍵
在 Expo 終端按：
- `r` - 重新加載
- `Shift + r` - 清除緩存並重新加載

### 方法 2: 在設備上
- 搖晃手機打開 Dev Menu
- 點擊 "Reload"

### 方法 3: 強制重啟
```bash
# Ctrl+C 停止服務器
# 然後重新啟動
npm start
```

---

## 📊 性能檢查

### 檢查動畫流暢度
- Welcome 頁面進度條應該流暢填充（不卡頓）
- 按鈕點擊反應靈敏

### 檢查記憶體使用
在 Expo Dev Menu 中：
- 打開 "Performance Monitor"
- 觀察 FPS 和內存使用

---

## 🎯 測試腳本（完整流程）

```bash
# 1. 進入 dapp 目錄
cd /home/kim/Chain-Split/dapp

# 2. 確認依賴已安裝
npm install

# 3. 清除緩存（可選，如果有問題）
npx expo start --clear

# 4. 啟動開發服務器（選擇一種方式）
npm start                # 正常模式
npm start -- --tunnel    # Tunnel 模式（如果網絡問題）
npm run android          # 直接在 Android 模擬器運行
npm run ios              # 直接在 iOS 模擬器運行（Mac）
npm run web              # 在瀏覽器運行
```

---

## 📸 截圖建議

建議截圖保存以下畫面作為記錄：
1. Welcome 頁面（進度條 0%）
2. Welcome 頁面（進度條 50%）
3. Welcome 頁面（進度條 100%）
4. Home 頁面（完整頁面）
5. 點擊按鈕後的 Console 輸出

---

## 🔒 安全提示

### 當前版本注意事項
- ✅ 沒有連接後端 API
- ✅ 沒有使用真實的私鑰
- ✅ 按鈕點擊僅在 Console 輸出
- ✅ 可以安全測試

### 未來添加錢包功能後
- ⚠️ 不要在測試環境使用真實資金
- ⚠️ 使用 Solana Devnet 進行測試
- ⚠️ 妥善保管測試私鑰

---

## 📝 測試報告模板

```markdown
## 測試報告

**測試日期**: YYYY-MM-DD
**測試人員**: [你的名字]
**測試設備**: [Android/iOS] [設備型號]
**測試方法**: [Expo Go / 模擬器 / Web]

### Welcome 頁面
- [ ] 通過
- 問題: [如有]

### Home 頁面
- [ ] 通過
- 問題: [如有]

### 性能
- FPS: [數值]
- 加載時間: [秒數]

### 其他問題
[記錄任何其他發現的問題]
```

---

## 🎉 預期成功結果

當所有測試通過時，你應該看到：

1. **Welcome 頁面** (2.5秒)
   - ✅ 金色 Logo 💰
   - ✅ Chain Split 標題
   - ✅ 流暢的進度條動畫

2. **自動跳轉** (無感知)

3. **Home 頁面**
   - ✅ Header with Logo
   - ✅ Welcome 標題
   - ✅ Get Started 按鈕
   - ✅ 3張功能卡片
   - ✅ Solana Footer

4. **交互**
   - ✅ 按鈕可點擊
   - ✅ Console 輸出正確

---

## 🆘 需要幫助？

如果遇到問題：
1. 檢查本指南的「常見問題排解」部分
2. 查看終端的錯誤訊息
3. 查看瀏覽器 Console (Debug Remote JS)
4. 提供完整的錯誤訊息以獲得幫助

---

**祝測試順利！** 🚀
