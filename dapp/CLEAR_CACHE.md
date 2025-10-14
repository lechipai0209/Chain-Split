# 🧹 清除緩存指南

當遇到以下情況時需要清除緩存：
- 代碼已更新但錯誤仍然存在
- 看到舊的代碼在運行
- Metro bundler 報錯

---

## 🚀 完整清除緩存方法

### 方法 1: 使用 Expo 命令（推薦）
```bash
npx expo start --clear
```

### 方法 2: 手動清除所有緩存
```bash
# 清除所有緩存目錄
rm -rf .expo node_modules/.cache .metro

# 然後重新啟動
npm start
```

### 方法 3: 終極清除（如果還有問題）
```bash
# 1. 清除所有緩存
rm -rf .expo node_modules/.cache .metro

# 2. 清除 watchman（如果已安裝）
watchman watch-del-all

# 3. 重啟 Metro
npm start
```

---

## ⚡ 快速命令

將以下命令添加到 package.json：
```json
{
  "scripts": {
    "clear": "rm -rf .expo node_modules/.cache .metro && echo '✅ 緩存已清除'",
    "fresh": "npm run clear && npx expo start --clear"
  }
}
```

然後使用：
```bash
npm run fresh
```

---

## 🔍 如何確認緩存已清除

1. 終端顯示 "✅ 緩存已清除"
2. Metro bundler 重新編譯所有文件
3. 看到 "Building JavaScript bundle" 消息

---

## 📱 如果問題仍然存在

### 重啟 Expo Go App
1. 完全關閉 Expo Go 應用
2. 從最近任務中移除
3. 重新打開並掃描 QR code

### 重啟開發服務器
```bash
# 1. 停止當前服務器（Ctrl+C）
# 2. 等待 2 秒
# 3. 重新啟動
npx expo start --clear
```

---

**現在試試清除緩存後重新啟動！** 🚀
