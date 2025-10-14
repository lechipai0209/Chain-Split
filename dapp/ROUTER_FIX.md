# 🔧 Expo Router 6 路由修復

> **問題**: 升級到 Expo SDK 54 (Router 6) 後路由報錯
> **狀態**: ✅ 已修復

---

## ❌ 問題描述

### 錯誤訊息
```
router.replace('/welcome');
           ^
```

### 原因
Expo Router 6 的路由 API 有變更：
- ❌ **舊方式**: `router.replace('/welcome')` (絕對路徑)
- ✅ **新方式**: `router.replace('welcome')` (相對路徑)

---

## ✅ 修復內容

### 1. `app/_layout.js`
```javascript
// 修復前
return <Stack/>;

// 修復後
return (
  <Stack
    screenOptions={{
      headerShown: false, // 隱藏所有頁面的 header
    }}
  />
);
```

**變更原因**:
- 明確設置 `screenOptions`
- 確保所有頁面默認隱藏 header
- 符合 Expo Router 6 的最佳實踐

---

### 2. `app/index.js`
```javascript
// 修復前
router.replace('/welcome');

// 修復後
router.replace('welcome'); // 移除開頭的 '/'
```

**額外改進**:
1. 添加 `setTimeout` 確保路由器已初始化
2. 添加 loading 狀態（顯示旋轉圖標）
3. 添加 dependency array `[router]`

---

### 3. `app/welcome.js`
```javascript
// 修復前
router.replace('/home');

// 修復後
router.replace('home'); // 移除開頭的 '/'
```

**額外改進**:
- 添加 dependency array `[router]`

---

## 📋 Expo Router 6 路由規則

### ✅ 正確的路由寫法

```javascript
// 相對路徑（推薦）
router.push('home');
router.replace('welcome');
router.back();

// 帶參數
router.push({
  pathname: 'details',
  params: { id: '123' }
});
```

### ❌ 避免的寫法

```javascript
// 不要使用絕對路徑
router.push('/home');        // ❌
router.replace('/welcome');  // ❌

// 使用相對路徑
router.push('home');         // ✅
router.replace('welcome');   // ✅
```

---

## 🗂️ 文件結構與路由映射

```
app/
├── _layout.js      → 根布局
├── index.js        → /
├── welcome.js      → /welcome
└── home.js         → /home
```

### 路由訪問方式

| 文件 | 路由路徑 | router.push() |
|------|---------|---------------|
| index.js | `/` | `router.push('/')` |
| welcome.js | `/welcome` | `router.push('welcome')` |
| home.js | `/home` | `router.push('home')` |

---

## 🎯 測試修復

### 預期行為

1. **啟動應用** → `index.js` 顯示 loading (0.1秒)
2. **自動跳轉** → `welcome.js` 顯示 Logo 和進度條
3. **等待 2.5秒** → 進度條填滿
4. **自動跳轉** → `home.js` 顯示主頁面

### 測試命令

```bash
# 清除緩存重新啟動
npx expo start --clear

# 或直接啟動
npm start
```

---

## 🔍 其他 Router 6 的重要變更

### 1. Layout 組件
```javascript
// 推薦：明確設置 screenOptions
<Stack
  screenOptions={{
    headerShown: false,
    animation: 'fade',
  }}
/>
```

### 2. 導航方法
```javascript
// ✅ 支持的方法
router.push()      // 導航到新頁面
router.replace()   // 替換當前頁面
router.back()      // 返回上一頁
router.canGoBack() // 檢查是否可以返回
```

### 3. 路由參數
```javascript
// 傳遞參數
router.push({
  pathname: 'user',
  params: { id: '123', name: 'John' }
});

// 接收參數
import { useLocalSearchParams } from 'expo-router';

function UserPage() {
  const { id, name } = useLocalSearchParams();
  return <Text>{id} - {name}</Text>;
}
```

---

## 📚 參考資料

- [Expo Router 6 Migration Guide](https://docs.expo.dev/router/migrate/expo-router-v6/)
- [Expo Router Navigation](https://docs.expo.dev/router/navigating-pages/)
- [Stack Navigator](https://docs.expo.dev/router/layouts/)

---

## ✅ 修復檢查清單

- [x] 更新 `_layout.js` 添加 screenOptions
- [x] 修復 `index.js` 路由跳轉（移除 `/`）
- [x] 修復 `welcome.js` 路由跳轉（移除 `/`）
- [x] 添加適當的 dependency arrays
- [x] 添加 loading 狀態

---

**修復完成！現在可以正常測試了** 🚀
