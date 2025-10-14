# Contract 資料夾結構說明

這是一個 **Solana 區塊鏈智能合約專案**，使用 **Anchor 框架**開發，主要功能是**群組費用分攤系統**（Chain-Split）。

## 📁 專案結構總覽

```
contract/
├── .anchor/              # Anchor 框架運行時資料  (Anchor)
├── migrations/           # 部署遷移腳本           
├── node_modules/         # Node.js 依賴套件
├── programs/             # Rust 智能合約原始碼
├── target/               # Rust 編譯輸出
├── tests/                # 測試腳本
├── Anchor.toml           # Anchor 專案配置        (Anchor)
├── Cargo.toml            # Rust 專案配置          (rust)
├── package.json          # Node.js 專案配置       (js)
├── yarn.lock             # Yarn 依賴鎖定文件      (Yarn) 
└── tsconfig.json         # TypeScript 配置        (ts)
```

---

## 📋 配置文件說明

### `Anchor.toml`
**Anchor 專案配置文件**

- 定義合約 ID: `EYR8PHamGh1S1PM7d7txEDzyqfGfnchMbQ6tNHMBBsfX`
- 設定網路環境為 `devnet`（開發網路）
- 配置錢包路徑: `/home/kim/.config/solana/id.json`
- 定義測試腳本命令

### `package.json`
**Node.js 專案配置**

主要依賴：
- `@coral-xyz/anchor` - Anchor 框架核心
- `mocha`, `chai` - 測試框架
- `typescript` - TypeScript 支援

腳本命令：
```bash
yarn lint       # 檢查程式碼格式
yarn lint:fix   # 自動修正格式
```

### `Cargo.toml`
**Rust 專案配置**

管理 Rust 依賴套件，定義工作區（workspace）結構。

### `yarn.lock`
**Yarn 依賴鎖定文件**

- 🔒 **鎖定版本** - 確保所有開發者安裝相同版本的套件
- 🔒 **自動生成** - 不應手動編輯
- 🔒 **應提交到 Git** - 確保團隊環境一致性
- 包含完整性校驗碼（integrity hash）

### `tsconfig.json`
**TypeScript 編譯配置**

定義 TypeScript 編譯選項和路徑設定。

---

## 🔧 核心合約程式碼 (`programs/contract/src/`)

### 📄 `lib.rs` - 主入口文件
定義了所有公開的合約函數，分為三大類角色：

#### 🏠 **Hoster（群組主持人）功能**
| 函數 | 說明 | 位置 |
|------|------|------|
| `create_group` | 建立群組 | `instructions/hoster/create_group.rs` |
| `remove_group_member` | 移除群組成員 | `instructions/hoster/remove_group_member.rs` |
| `close_group` | 關閉群組 | `instructions/hoster/close_group.rs` |

#### 👥 **Member（成員）功能**
| 函數 | 說明 | 位置 |
|------|------|------|
| `join_group` | 加入群組 | `instructions/member/join_group.rs` |
| `sign_expense` | 簽署/驗證費用 | `instructions/member/sign_expense.rs` |
| `pay_with_usd` | 用 USD 付款 | `instructions/member/pay_with_usd.rs` |
| `pay_with_usdt` | 用 USDT 付款 | `instructions/member/pay_with_usdt.rs` |
| `close_pay_with_usd` | 關閉 USD 付款 | `instructions/member/close_pay_with_usd.rs` |

#### 💰 **Payer（付款人）功能**
| 函數 | 說明 | 位置 |
|------|------|------|
| `create_expense` | 建立費用記錄 | `instructions/payer/create_expense.rs` |
| `confirm_usd` | 確認 USD 付款 | `instructions/payer/confirm_usd.rs` |
| `finalize_expense` | 結算費用 | `instructions/payer/finalize_expense.rs` |
| `close_expense` | 關閉費用記錄 | `instructions/payer/close_expense.rs` |

### 📄 `state.rs` - 資料結構定義

定義了三個主要的鏈上帳戶結構：

#### 1. **GroupAccount** (760 bytes)
群組帳戶，儲存群組成員和淨額資訊。

```rust
pub struct GroupAccount {
    pub payer: Pubkey,          // 32 bytes - 付款人地址
    pub member: [Pubkey; 20],   // 640 bytes - 最多 20 個成員
    pub net: [i32; 20],         // 80 bytes - 每個成員的淨額
}
```

#### 2. **ExpenseAccount** (848 bytes)
費用帳戶，記錄一筆費用的所有資訊。

```rust
pub struct ExpenseAccount {
    pub group: Pubkey,              // 32 bytes - 群組地址
    pub payer: Pubkey,              // 32 bytes - 付款人地址
    pub amount: u32,                // 4 bytes - 總金額
    pub member: [Pubkey; 20],       // 640 bytes - 成員列表
    pub expense: [u32; 20],         // 80 bytes - 各成員費用
    pub verified: [VerifiedType; 20], // 20 bytes - 驗證狀態
    pub finalized: bool,            // 1 byte - 是否已結算
}
```

**VerifiedType 枚舉：**
- `None` - 尚未驗證
- `True` - 已確認
- `False` - 已拒絕

#### 3. **PaymentAccount**
付款帳戶，記錄成員間的付款。

```rust
pub struct PaymentAccount {
    pub group: Pubkey,      // 32 bytes - 群組地址
    pub payer: Pubkey,      // 32 bytes - 付款人地址
    pub recipient: Pubkey,  // 32 bytes - 收款人地址
    pub amount: u32,        // 4 bytes - 金額
    pub verified: bool,     // 1 byte - 是否已驗證
}
```

### 📂 `instructions/` - 指令實作目錄

所有合約邏輯的具體實作，按角色分類：

- **`hoster/`** - 主持人相關指令
- **`member/`** - 成員相關指令
- **`payer/`** - 付款人相關指令
- **`mod.rs`** - 模組匯出

---

## 📂 資料夾詳細說明

### `.anchor/` - Anchor 框架運行時資料

**內容：**
- `program-logs/` - 程式執行日誌
- `test-ledger/` - 本地測試區塊鏈的帳本資料

**特性：**
- ⚠️ 本地測試專用，執行 `anchor test` 時自動生成
- ⚠️ 不應提交到 Git
- ⚠️ 可以安全刪除，下次測試會重新生成

---

### `migrations/` - 部署遷移腳本

**檔案：** `deploy.ts`

**用途：** 合約部署時執行的腳本

**內容：**
```typescript
// 配置 provider，用於部署合約
anchor.setProvider(provider);
// 可以在這裡添加部署後的初始化邏輯
```

**執行時機：**
- 執行 `anchor deploy` 時會調用此腳本
- 可以添加初始化合約狀態的邏輯

---

### `node_modules/` - Node.js 依賴套件

**用途：** 存放所有 JavaScript/TypeScript 依賴

**主要套件：**
- `@coral-xyz/anchor` - Anchor 框架
- `@solana/web3.js` - Solana JavaScript SDK
- `mocha`, `chai`, `ts-mocha` - 測試框架
- `typescript`, `ts-node` - TypeScript 支援
- 以及其他 100+ 個依賴套件

**生成方式：**
```bash
yarn install
# 或
npm install
```

**特性：**
- ⚠️ 由 `yarn install` 根據 `package.json` 和 `yarn.lock` 生成
- ⚠️ 不應提交到 Git（體積龐大）
- ⚠️ 可以刪除並重新安裝

---

### `target/` - Rust 編譯輸出

**用途：** Rust 編譯和 Anchor 建置產物

#### 重要子資料夾：

##### `target/deploy/` - 部署文件
- **`contract.so`** - 編譯後的 Solana 程式（Shared Object 二進制文件）
- **`contract-keypair.json`** - 程式的密鑰對（用於生成程式 ID）

##### `target/idl/` - 介面定義語言 (IDL)
- **`contract.json`** - **IDL 文件**，描述合約的所有函數、參數、帳戶結構
  - 類似於 Ethereum 的 ABI (Application Binary Interface)
  - 前端客戶端需要此文件來調用合約
  - 定義了所有公開函數的簽名和結構

##### `target/types/` - TypeScript 型別定義
- **`contract.ts`** - 從 IDL 自動生成的 TypeScript 型別定義
  - 提供型別安全的客戶端調用
  - 包含所有帳戶、指令、事件的型別

#### 其他目錄：
- `release/` - Release 模式編譯產物
- `sbf-solana-solana/` - Solana BPF 目標編譯輸出
- `.rustc_info.json` - Rust 編譯器資訊

**生成方式：**
```bash
anchor build
```

**特性：**
- ⚠️ 編譯產物，不應提交到 Git（除了 `idl/` 和 `types/` 可能需要給前端使用）
- ⚠️ 可以安全刪除並重新編譯

---

### `tests/` - 測試腳本

**檔案：** `contract.ts`

**用途：** 完整的端對端（E2E）整合測試

#### 測試內容包括：

##### 🛠️ **輔助函數**
- `createTestUser()` - 創建測試用戶並空投 SOL
- `generateRandomNonce()` - 生成隨機 nonce

##### 📋 **測試流程**

1. **群組管理測試**
   - ✅ 創建群組 (`create_group`)
   - ✅ 成員加入群組 (`join_group`)
   - ✅ 移除群組成員 (`remove_group_member`)
   - ✅ 關閉群組 (`close_group`)

2. **費用處理測試**
   - ✅ 創建費用記錄 (`create_expense`)
   - ✅ 成員簽署驗證費用 (`sign_expense`)
   - ✅ 自動結算檢測
   - ✅ 手動結算費用 (`finalize_expense`)
   - ✅ 關閉費用記錄 (`close_expense`)

3. **付款功能測試**
   - ✅ USD 付款 (`pay_with_usd`)
   - ✅ 確認 USD 付款 (`confirm_usd`)
   - ✅ 關閉付款 (`close_pay_with_usd`)

#### 執行測試：

```bash
# 執行所有測試
anchor test

# 或使用 yarn
yarn test

# 僅運行測試（不重新編譯）
anchor test --skip-build
```

#### 測試特色：
- 使用 **Mocha** 測試框架
- 使用 **EventParser** 解析鏈上事件日誌
- 完整覆蓋所有主要功能
- 包含事件日誌驗證
- 支援自動化 CI/CD 流程

---

## 📊 資料夾管理總結

| 資料夾 | 用途 | 提交 Git | 可刪除 | 生成方式 |
|--------|------|---------|--------|---------|
| `.anchor/` | 測試環境數據 | ❌ | ✅ | `anchor test` |
| `migrations/` | 部署腳本 | ✅ | ❌ | 手動編寫 |
| `node_modules/` | JS 依賴 | ❌ | ✅ | `yarn install` |
| `programs/` | 合約原始碼 | ✅ | ❌ | 手動編寫 |
| `target/` | 編譯產物 | ❌* | ✅ | `anchor build` |
| `tests/` | 測試程式碼 | ✅ | ❌ | 手動編寫 |

*註：`target/idl/` 和 `target/types/` 可能需要提交給前端使用

---

## 🚀 常用命令

### 編譯與建置
```bash
# 編譯合約
anchor build

# 清理編譯產物
anchor clean
```

### 測試
```bash
# 運行測試（包含編譯）
anchor test

# 僅測試，不重新編譯
anchor test --skip-build

# 指定網路測試
anchor test --provider.cluster devnet
```

### 部署
```bash
# 部署到配置的網路（Anchor.toml 中定義）
anchor deploy

# 部署到特定網路
anchor deploy --provider.cluster devnet
```

### 本地驗證器
```bash
# 啟動本地 Solana 驗證器
solana-test-validator

# 查看日誌
solana logs
```

### 安裝依賴
```bash
# 安裝 JavaScript 依賴
yarn install

# 更新 Anchor
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
```

---

## 🔗 相關文件

- [Anchor 官方文檔](https://www.anchor-lang.com/)
- [Solana 開發者文檔](https://docs.solana.com/)
- [Solana Web3.js](https://solana-labs.github.io/solana-web3.js/)

---

## 📝 備註

- 合約 Program ID: `EYR8PHamGh1S1PM7d7txEDzyqfGfnchMbQ6tNHMBBsfX`
- 目前部署網路: `devnet`
- Rust 版本要求: 查看 `rust-toolchain.toml`（如果存在）
- Node.js 版本建議: v16 或更高

---

**最後更新：** 2025-10-09
