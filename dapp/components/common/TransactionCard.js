import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SIZES } from '../../constants';

const TransactionCard = ({ transaction }) => {
  const router = useRouter();

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'payment_received':
        return '💰';
      case 'expense_created':
        return '📝';
      case 'payment_confirmed':
        return '✅';
      case 'expense_finalized':
        return '🎉';
      case 'member_joined':
        return '👋';
      default:
        return '📋';
    }
  };

  const getTransactionTitle = (type) => {
    switch (type) {
      case 'payment_received':
        return '收到付款';
      case 'expense_created':
        return '新增帳款';
      case 'payment_confirmed':
        return '付款已確認';
      case 'expense_finalized':
        return '帳款已結清';
      case 'member_joined':
        return '新成員加入';
      default:
        return '通知';
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case 'payment_received':
        return '#4CAF50';
      case 'expense_created':
        return '#FF9800';
      case 'payment_confirmed':
        return '#2196F3';
      case 'expense_finalized':
        return '#9C27B0';
      case 'member_joined':
        return '#607D8B';
      default:
        return COLORS.gray;
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '剛剛';
    if (diffMins < 60) return `${diffMins} 分鐘前`;
    if (diffHours < 24) return `${diffHours} 小時前`;
    if (diffDays < 7) return `${diffDays} 天前`;

    return date.toLocaleDateString('zh-TW', {
      month: 'numeric',
      day: 'numeric',
    });
  };

  const handlePress = () => {
    if (transaction.expenseId) {
      router.push(`/expenseDetail?id=${transaction.expenseId}`);
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <View
          style={[
            styles.iconCircle,
            { backgroundColor: getTransactionColor(transaction.type) + '20' },
          ]}
        >
          <Text style={styles.icon}>{getTransactionIcon(transaction.type)}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{getTransactionTitle(transaction.type)}</Text>
          <Text style={styles.timestamp}>
            {formatTimestamp(transaction.timestamp)}
          </Text>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {transaction.description}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.groupName}>{transaction.groupName}</Text>
          {transaction.amount && (
            <Text style={styles.amount}>$ {transaction.amount}</Text>
          )}
        </View>

        {transaction.from && (
          <Text style={styles.from}>來自: {transaction.from}</Text>
        )}
      </View>

      <View style={styles.indicator}>
        <View
          style={[
            styles.indicatorDot,
            { backgroundColor: getTransactionColor(transaction.type) },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    marginRight: 12,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    color: COLORS.black,
  },
  timestamp: {
    fontSize: SIZES.xSmall,
    color: COLORS.gray,
  },
  description: {
    fontSize: SIZES.small,
    color: COLORS.darkGray || '#666',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  groupName: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    fontWeight: '500',
  },
  amount: {
    fontSize: SIZES.medium,
    fontWeight: '700',
    color: COLORS.gold,
  },
  from: {
    fontSize: SIZES.xSmall,
    color: COLORS.gray,
    marginTop: 4,
  },
  indicator: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default TransactionCard;
