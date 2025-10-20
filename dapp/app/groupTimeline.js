import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { COLORS, SIZES } from '../constants';
import { getGroupById, getExpensesByGroup } from '../data/mockData';

/**
 * 群組交易時間線頁面
 * 顯示群組內所有交易記錄的時間線
 */
const GroupTimeline = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const group = getGroupById(id);
  const expenses = getExpensesByGroup(id);

  if (!group) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>群組不存在</Text>
      </SafeAreaView>
    );
  }

  // 按時間排序（最新在上）
  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{group.name}</Text>
          <Text style={styles.headerSubtitle}>交易時間線</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      {/* Timeline */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {sortedExpenses.length > 0 ? (
          sortedExpenses.map((expense, index) => (
            <View key={expense.id} style={styles.timelineItem}>
              {/* Timeline Line */}
              <View style={styles.timelineLineContainer}>
                {index !== 0 && <View style={styles.timelineLineTop} />}
                <View
                  style={[
                    styles.timelineDot,
                    expense.status === 'finalized' && styles.dotFinalized,
                    expense.status === 'completed' && styles.dotCompleted,
                  ]}
                />
                {index !== sortedExpenses.length - 1 && (
                  <View style={styles.timelineLineBottom} />
                )}
              </View>

              {/* Content */}
              <TouchableOpacity
                style={styles.timelineCard}
                onPress={() => router.push(`/expenseDetail?id=${expense.id}`)}
                activeOpacity={0.7}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.expenseDescription}>
                    {expense.description}
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      expense.status === 'finalized' && styles.statusFinalized,
                      expense.status === 'completed' && styles.statusCompleted,
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {expense.status === 'pending' && '進行中'}
                      {expense.status === 'completed' && '已完成'}
                      {expense.status === 'finalized' && '已結清'}
                    </Text>
                  </View>
                </View>

                <Text style={styles.amount}>${expense.totalAmount}</Text>

                <View style={styles.cardFooter}>
                  <Text style={styles.dateText}>
                    {formatDate(expense.createdAt)}
                  </Text>
                  <Text style={styles.participantsText}>
                    {expense.participants.filter((p) => p.paid).length}/
                    {expense.participants.length} 人已付款
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📝</Text>
            <Text style={styles.emptyText}>還沒有交易記錄</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backGround || '#F5F5F5',
  },
  header: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 28,
    color: COLORS.black,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: SIZES.large,
    fontWeight: '700',
    color: COLORS.black,
  },
  headerSubtitle: {
    fontSize: SIZES.xSmall,
    color: COLORS.gray,
    marginTop: 2,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  timelineLineContainer: {
    width: 40,
    alignItems: 'center',
    marginRight: 12,
  },
  timelineLineTop: {
    width: 2,
    flex: 1,
    backgroundColor: COLORS.lightGray || '#E0E0E0',
  },
  timelineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFA726',
    borderWidth: 3,
    borderColor: COLORS.white,
    zIndex: 1,
  },
  dotCompleted: {
    backgroundColor: '#66BB6A',
  },
  dotFinalized: {
    backgroundColor: '#9C27B0',
  },
  timelineLineBottom: {
    width: 2,
    flex: 1,
    backgroundColor: COLORS.lightGray || '#E0E0E0',
  },
  timelineCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  expenseDescription: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    color: COLORS.black,
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    backgroundColor: '#FFA726',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusCompleted: {
    backgroundColor: '#66BB6A',
  },
  statusFinalized: {
    backgroundColor: '#9C27B0',
  },
  statusText: {
    fontSize: SIZES.xSmall,
    color: COLORS.white,
    fontWeight: '600',
  },
  amount: {
    fontSize: SIZES.xLarge,
    fontWeight: '700',
    color: COLORS.gold,
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: SIZES.xSmall,
    color: COLORS.gray,
  },
  participantsText: {
    fontSize: SIZES.xSmall,
    color: COLORS.darkgray,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: SIZES.large,
    fontWeight: '600',
    color: COLORS.gray,
  },
  errorText: {
    fontSize: SIZES.large,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 40,
  },
});

export default GroupTimeline;
