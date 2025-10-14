# Chain-Split React Native App 畫面說明

> **創建日期**: 2025-10-14
> **狀態**: ✅ 完成基礎畫面建置

---

## 📱 應用結構

### 路由流程
```
app/index.js → app/welcome.js → app/home.js
     ↓              ↓                ↓
   自動跳轉      Loading頁面      主頁面
```

---

## 🎨 Screen 1: Welcome/Loading 頁面

### 文件位置
`/dapp/app/welcome.js`

### 功能描述
- **目的**: 應用啟動時的歡迎/加載頁面
- **顯示時長**: 2.5秒
- **自動跳轉**: 加載完成後自動跳轉到主頁面

### 視覺元素

#### 1. Logo 區域（頂部居中）
```
┌─────────────────────────┐
│                         │
│       ╭─────────╮       │
│       │   💰    │       │  ← Logo圓形容器（金色背景）
│       ╰─────────╯       │
│                         │
│    Chain Split          │  ← 應用名稱（粗體，大字）
│  Smart Group Payment    │  ← 標語（灰色，小字）
│                         │
└─────────────────────────┘
```

#### 2. 進度條區域（底部）
```
┌─────────────────────────┐
│  ▓▓▓▓▓▓▓▓▓░░░░░░░░░░   │  ← 動畫進度條（金色）
│                         │
│      Loading...         │  ← 加載文字
└─────────────────────────┘
```

### 樣式特點
- **Logo圓形**:
  - 尺寸: 120x120
  - 背景色: #FFD700 (金色)
  - 陰影效果
  - Emoji: 💰 (60px)

- **應用名稱**:
  - 字體大小: 50px
  - 顏色: #1a1a1a (深黑色)
  - 字重: bold

- **進度條**:
  - 寬度: 螢幕寬度 - 80px
  - 高度: 6px
  - 背景: 淺灰色
  - 填充: 金色 (#FFD700)
  - 動畫: 2.5秒線性填滿

### 技術實現
```javascript
// 使用 Animated API 實現流暢的進度條動畫
Animated.timing(progress, {
  toValue: 1,
  duration: 2500,
  useNativeDriver: false,
}).start(() => {
  router.replace('/home'); // 完成後跳轉
});
```

---

## 🏠 Screen 2: 主頁面 (Home)

### 文件位置
`/dapp/app/home.js`

### 功能描述
- **目的**: 應用的主界面，展示歡迎信息和功能介紹
- **當前狀態**: 靜態展示頁面（未連接後端）
- **按鈕行為**: 僅在 console 輸出，無實際功能

### 頁面結構

#### 1. Header（頂部導航欄）
```
┌─────────────────────────────────┐
│  Chain Split              💰   │  ← Logo圖標（右側）
└─────────────────────────────────┘
```

#### 2. Welcome Section（歡迎區域）
```
        Welcome!
Ready to manage your group expenses

    [  Get Started  ]  ← 主按鈕（金色）
```

#### 3. Info Cards（功能介紹卡片）

**卡片 1: Create Groups**
```
┌─────────────────────────────┐
│  👥                         │
│  Create Groups              │
│  Organize your friends and  │
│  split expenses easily      │
└─────────────────────────────┘
```

**卡片 2: Track Payments**
```
┌─────────────────────────────┐
│  💳                         │
│  Track Payments             │
│  Keep track of who paid     │
│  and who owes               │
└─────────────────────────────┘
```

**卡片 3: Instant Settlement**
```
┌─────────────────────────────┐
│  ⚡                         │
│  Instant Settlement         │
│  Settle up with blockchain  │
│  technology                 │
└─────────────────────────────┘
```

#### 4. Footer（頁腳）
```
┌─────────────────────────────────┐
│  Powered by Solana Blockchain   │
└─────────────────────────────────┘
```

### 樣式特點

**Header**
- 背景: 白色
- 底部邊框: 淺灰色
- Logo容器: 40x40 圓形，金色背景

**Welcome Button**
- 背景: #FFD700 (金色)
- 內邊距: 16px (上下) × 48px (左右)
- 圓角: 12px
- 陰影效果
- 文字: 20px, bold

**Info Cards**
- 背景: #f8f8f8 (淺灰)
- 邊框: 1px, 淺灰色
- 圓角: 12px
- 內邊距: 20px
- Emoji圖標: 32px
- 間距: 16px

### 事件處理
```javascript
const handleWelcomePress = () => {
  // 目前不需要任何反應
  console.log('Welcome button pressed');
};
```

---

## 🔄 路由配置

### app/_layout.js
```javascript
import { Stack } from "expo-router";

const Layout = () => {
  return <Stack/>;
}

export default Layout;
```

### app/index.js
```javascript
// 自動重定向到 welcome 頁面
const Index = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/welcome');
  }, []);

  return null;
};
```

**路由映射**:
- `/` (index.js) → 自動跳轉到 `/welcome`
- `/welcome` (welcome.js) → Welcome/Loading頁面
- `/home` (home.js) → 主頁面

---

## 🎨 設計主題

### 顏色配置 (constants/theme.js)
```javascript
const COLORS = {
  white: "#ffffff",
  gray: "#e1e1de",
  green: "#4caf50",
  darkgray: "#8e99a3",
  transparent: "transparent"
};
```

**主題色**:
- 主色: #FFD700 (金色) - Logo、按鈕、強調元素
- 背景: #ffffff (白色)
- 文字: #1a1a1a (深黑色)
- 次要文字: #8e99a3 (深灰色)
- 邊框/分隔: #e1e1de (淺灰色)

### 字體配置
```javascript
const FONTS = {
  small: 15,
  regular: 20,
  medium: 23,
  title: 30,
  importance: 50,
};
```

### 尺寸配置
```javascript
const SIZES = {
  xSmall: 10,
  small: 15,
  medium: 20,
  large: 24,
  xLarge: 30,
  xxLarge: 40,
};
```

---

## 📦 依賴項

### 當前使用的依賴
- `react-native`: UI 框架
- `expo-router`: 路由管理
- `expo`: 開發工具集

### 未使用但已安裝（可能用於後續開發）
- `@solana/web3.js`: Solana 區塊鏈交互
- `@coral-xyz/anchor`: Anchor 框架
- `@react-native-firebase`: Firebase 推送通知
- `tweetnacl`, `bs58`: 加密工具
- `native-notify`: 推送通知服務

---

## 🔧 後續開發建議

### 1. 本地錢包集成
目前已規劃創建本地錢包系統（不依賴 Phantom）：
- 在本地生成/導入密鑰對
- 本地簽名交易
- 使用 expo-secure-store 安全存儲

### 2. 主頁面功能擴展
- 連接本地錢包
- 顯示錢包餘額
- 群組列表展示
- 費用記錄查詢

### 3. 新增頁面
- 創建群組頁面
- 群組詳情頁面
- 費用創建頁面
- 交易記錄頁面
- 設置頁面

### 4. 與智能合約集成
- 使用 `instruction/` 目錄下的函數
- 實現創建群組、加入群組等功能
- 處理交易簽名和發送

---

## 📝 備註

### Phantom 相關代碼
舊的 Phantom 錢包集成代碼已備份到 git stash：
```bash
# 查看備份
git stash list

# 恢復 Phantom 代碼（如需要）
git stash apply stash@{0}
```

### 測試建議
1. 在 Expo Go 中測試界面
2. 檢查路由跳轉是否流暢
3. 驗證動畫效果
4. 測試不同設備尺寸的適配

### 已知問題
- ✅ 無重大問題
- ⚠️ 按鈕功能尚未實現（按計劃）

---

**更新者**: Claude Code
**文檔版本**: 1.0
**最後更新**: 2025-10-14
