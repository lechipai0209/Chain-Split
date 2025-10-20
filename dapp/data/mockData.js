// Mock data for development and UI testing

// Current user wallet address (mock)
export const CURRENT_USER = "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU";

// Mock groups data
export const GROUPS = [
  {
    id: "group_001",
    name: "🍕 週末聚餐",
    hoster: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU", // Current user is hoster
    members: [
      {
        address: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
        name: "You",
        joinedAt: "2025-01-10T10:00:00Z",
      },
      {
        address: "8yLZuh3JD98f08UKTEqcE6kCifYzDqC94UAVskptBtV",
        name: "Alice",
        joinedAt: "2025-01-10T10:05:00Z",
      },
      {
        address: "9zMAvj4KE09g19VLUFrdF7lDjgAzErD05VBWtlquCuW",
        name: "Bob",
        joinedAt: "2025-01-10T10:10:00Z",
      },
    ],
    createdAt: "2025-01-10T10:00:00Z",
    isActive: true,
  },
  {
    id: "group_002",
    name: "🏠 室友分帳",
    hoster: "8yLZuh3JD98f08UKTEqcE6kCifYzDqC94UAVskptBtV", // Alice is hoster
    members: [
      {
        address: "8yLZuh3JD98f08UKTEqcE6kCifYzDqC94UAVskptBtV",
        name: "Alice",
        joinedAt: "2025-01-08T14:00:00Z",
      },
      {
        address: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
        name: "You",
        joinedAt: "2025-01-08T14:05:00Z",
      },
      {
        address: "AzNBvw5LE10h20WMVGseG8mEkhBzFsE16WCXumrvDvX",
        name: "Charlie",
        joinedAt: "2025-01-08T14:10:00Z",
      },
      {
        address: "BaOCxy6MF21i31XNWHtfH9nFliCaGtF27XDYvnswExY",
        name: "David",
        joinedAt: "2025-01-08T14:15:00Z",
      },
    ],
    createdAt: "2025-01-08T14:00:00Z",
    isActive: true,
  },
  {
    id: "group_003",
    name: "✈️ 日本旅遊",
    hoster: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU", // Current user is hoster
    members: [
      {
        address: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
        name: "You",
        joinedAt: "2025-01-05T09:00:00Z",
      },
      {
        address: "9zMAvj4KE09g19VLUFrdF7lDjgAzErD05VBWtlquCuW",
        name: "Bob",
        joinedAt: "2025-01-05T09:30:00Z",
      },
    ],
    createdAt: "2025-01-05T09:00:00Z",
    isActive: true,
  },
];

// Mock expenses data
export const EXPENSES = [
  {
    id: "expense_001",
    groupId: "group_001",
    groupName: "🍕 週末聚餐",
    payer: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU", // Current user is payer
    totalAmount: 1500,
    description: "義式餐廳晚餐",
    createdAt: "2025-01-12T19:30:00Z",
    status: "pending", // pending, completed, finalized
    participants: [
      {
        address: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
        name: "You",
        amount: 500,
        paid: true,
        signedAt: "2025-01-12T19:30:00Z",
      },
      {
        address: "8yLZuh3JD98f08UKTEqcE6kCifYzDqC94UAVskptBtV",
        name: "Alice",
        amount: 500,
        paid: true,
        signedAt: "2025-01-12T20:15:00Z",
      },
      {
        address: "9zMAvj4KE09g19VLUFrdF7lDjgAzErD05VBWtlquCuW",
        name: "Bob",
        amount: 500,
        paid: false,
        signedAt: null,
      },
    ],
  },
  {
    id: "expense_002",
    groupId: "group_002",
    groupName: "🏠 室友分帳",
    payer: "8yLZuh3JD98f08UKTEqcE6kCifYzDqC94UAVskptBtV", // Alice is payer
    totalAmount: 8000,
    description: "一月份房租",
    createdAt: "2025-01-01T10:00:00Z",
    status: "completed",
    participants: [
      {
        address: "8yLZuh3JD98f08UKTEqcE6kCifYzDqC94UAVskptBtV",
        name: "Alice",
        amount: 2000,
        paid: true,
        signedAt: "2025-01-01T10:00:00Z",
      },
      {
        address: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
        name: "You",
        amount: 2000,
        paid: true,
        signedAt: "2025-01-02T15:30:00Z",
      },
      {
        address: "AzNBvw5LE10h20WMVGseG8mEkhBzFsE16WCXumrvDvX",
        name: "Charlie",
        amount: 2000,
        paid: true,
        signedAt: "2025-01-03T09:20:00Z",
      },
      {
        address: "BaOCxy6MF21i31XNWHtfH9nFliCaGtF27XDYvnswExY",
        name: "David",
        amount: 2000,
        paid: true,
        signedAt: "2025-01-02T18:45:00Z",
      },
    ],
  },
  {
    id: "expense_003",
    groupId: "group_003",
    groupName: "✈️ 日本旅遊",
    payer: "9zMAvj4KE09g19VLUFrdF7lDjgAzErD05VBWtlquCuW", // Bob is payer
    totalAmount: 3600,
    description: "東京迪士尼門票",
    createdAt: "2025-01-11T14:20:00Z",
    status: "pending",
    participants: [
      {
        address: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
        name: "You",
        amount: 1800,
        paid: false,
        signedAt: null,
      },
      {
        address: "9zMAvj4KE09g19VLUFrdF7lDjgAzErD05VBWtlquCuW",
        name: "Bob",
        amount: 1800,
        paid: true,
        signedAt: "2025-01-11T14:20:00Z",
      },
    ],
  },
  {
    id: "expense_004",
    groupId: "group_001",
    groupName: "🍕 週末聚餐",
    payer: "8yLZuh3JD98f08UKTEqcE6kCifYzDqC94UAVskptBtV", // Alice is payer
    totalAmount: 900,
    description: "咖啡廳下午茶",
    createdAt: "2025-01-13T15:45:00Z",
    status: "finalized",
    participants: [
      {
        address: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
        name: "You",
        amount: 300,
        paid: true,
        signedAt: "2025-01-13T16:00:00Z",
      },
      {
        address: "8yLZuh3JD98f08UKTEqcE6kCifYzDqC94UAVskptBtV",
        name: "Alice",
        amount: 300,
        paid: true,
        signedAt: "2025-01-13T15:45:00Z",
      },
      {
        address: "9zMAvj4KE09g19VLUFrdF7lDjgAzErD05VBWtlquCuW",
        name: "Bob",
        amount: 300,
        paid: true,
        signedAt: "2025-01-13T16:10:00Z",
      },
    ],
  },
];

// Mock USD payment accounts
export const USD_PAYMENTS = [
  {
    id: "usd_001",
    expenseId: "expense_001",
    groupName: "🍕 週末聚餐",
    payer: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    member: "9zMAvj4KE09g19VLUFrdF7lDjgAzErD05VBWtlquCuW",
    memberName: "Bob",
    amount: 500,
    status: "pending", // pending, confirmed, closed
    createdAt: "2025-01-13T10:30:00Z",
    confirmedAt: null,
  },
  {
    id: "usd_002",
    expenseId: "expense_002",
    groupName: "🏠 室友分帳",
    payer: "8yLZuh3JD98f08UKTEqcE6kCifYzDqC94UAVskptBtV",
    member: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    memberName: "You",
    amount: 2000,
    status: "confirmed",
    createdAt: "2025-01-02T14:00:00Z",
    confirmedAt: "2025-01-02T15:30:00Z",
  },
];

// Mock transactions/notifications (for home page feed)
export const TRANSACTIONS = [
  {
    id: "trans_001",
    type: "payment_received", // payment_received, expense_created, payment_confirmed, expense_finalized, member_joined
    from: "Alice",
    fromAddress: "8yLZuh3JD98f08UKTEqcE6kCifYzDqC94UAVskptBtV",
    amount: 500,
    groupName: "🍕 週末聚餐",
    description: "義式餐廳晚餐",
    timestamp: "2025-01-12T20:15:00Z",
    expenseId: "expense_001",
  },
  {
    id: "trans_002",
    type: "expense_created",
    from: "Bob",
    fromAddress: "9zMAvj4KE09g19VLUFrdF7lDjgAzErD05VBWtlquCuW",
    amount: 3600,
    groupName: "✈️ 日本旅遊",
    description: "東京迪士尼門票",
    timestamp: "2025-01-11T14:20:00Z",
    expenseId: "expense_003",
  },
  {
    id: "trans_003",
    type: "payment_confirmed",
    from: "Alice",
    fromAddress: "8yLZuh3JD98f08UKTEqcE6kCifYzDqC94UAVskptBtV",
    amount: 2000,
    groupName: "🏠 室友分帳",
    description: "一月份房租 - USD 現金付款已確認",
    timestamp: "2025-01-02T15:30:00Z",
    expenseId: "expense_002",
  },
  {
    id: "trans_004",
    type: "expense_finalized",
    from: "Alice",
    fromAddress: "8yLZuh3JD98f08UKTEqcE6kCifYzDqC94UAVskptBtV",
    amount: 900,
    groupName: "🍕 週末聚餐",
    description: "咖啡廳下午茶",
    timestamp: "2025-01-13T16:15:00Z",
    expenseId: "expense_004",
  },
  {
    id: "trans_005",
    type: "member_joined",
    from: "Charlie",
    fromAddress: "AzNBvw5LE10h20WMVGseG8mEkhBzFsE16WCXumrvDvX",
    groupName: "🏠 室友分帳",
    description: "新成員加入群組",
    timestamp: "2025-01-08T14:10:00Z",
  },
  {
    id: "trans_006",
    type: "expense_created",
    from: "You",
    fromAddress: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    amount: 1500,
    groupName: "🍕 週末聚餐",
    description: "義式餐廳晚餐",
    timestamp: "2025-01-12T19:30:00Z",
    expenseId: "expense_001",
  },
];

// Helper functions
export const getGroupById = (groupId) => {
  return GROUPS.find((group) => group.id === groupId);
};

export const getExpensesByGroup = (groupId) => {
  return EXPENSES.filter((expense) => expense.groupId === groupId);
};

export const getExpenseById = (expenseId) => {
  return EXPENSES.find((expense) => expense.id === expenseId);
};

export const getUserGroups = (userAddress) => {
  return GROUPS.filter((group) =>
    group.members.some((member) => member.address === userAddress)
  );
};

export const isUserHoster = (groupId, userAddress) => {
  const group = getGroupById(groupId);
  return group && group.hoster === userAddress;
};

export const isUserPayer = (expenseId, userAddress) => {
  const expense = getExpenseById(expenseId);
  return expense && expense.payer === userAddress;
};

export const getRecentTransactions = (limit = 10) => {
  return TRANSACTIONS.sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  ).slice(0, limit);
};
