import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { COLORS, SIZES } from '../constants';
import {
  getGroupById,
  getExpensesByGroup,
  CURRENT_USER,
  isUserHoster,
} from '../data/mockData';

/**
 * 群組詳情頁面
 * 顯示群組資訊、成員列表和帳款列表
 */
const GroupDetail = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState('expenses'); // expenses, members

  const group = getGroupById(id);
  const expenses = getExpensesByGroup(id);
  const isHoster = isUserHoster(id, CURRENT_USER);

  if (!group) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>群組不存在</Text>
      </SafeAreaView>
    );
  }

  const handleCreateExpense = () => {
    if (!isHoster) {
      Alert.alert('提示', '只有群組主辦人可以創建帳款');
      return;
    }
    router.push(`/createExpense?groupId=${id}`);
  };

  const handleShareGroupId = () => {
    Alert.alert('群組 ID', id, [
      { text: '複製', onPress: () => Alert.alert('提示', '已複製到剪貼板') },
      { text: '取消', style: 'cancel' },
    ]);
  };

  const handleRemoveMember = (memberAddress) => {
    if (!isHoster) {
      Alert.alert('提示', '只有群組主辦人可以移除成員');
      return;
    }

    // 檢查該成員是否有未結清的款項
    const memberExpenses = expenses.filter(expense =>
      expense.status !== 'finalized' &&
      expense.participants.some(p =>
        p.address === memberAddress && (!p.paid || expense.payer === memberAddress)
      )
    );

    if (memberExpenses.length > 0) {
      Alert.alert(
        '無法移除',
        '此成員仍有未結清的款項，請先完成所有相關帳款後再移除',
        [{ text: '確定', style: 'default' }]
      );
      return;
    }

    Alert.alert(
      '確認移除成員',
      '確定要將此成員移出群組嗎？此操作無法復原。',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '移除',
          style: 'destructive',
          onPress: () => Alert.alert('成功', '成員已移除'),
        },
      ]
    );
  };

  const handleCloseGroup = () => {
    if (!isHoster) {
      Alert.alert('提示', '只有群組主辦人可以關閉群組');
      return;
    }
    Alert.alert(
      '確認關閉群組',
      '關閉後所有成員將無法再使用此群組，且無法恢復',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '確認關閉',
          style: 'destructive',
          onPress: () => {
            Alert.alert('成功', '群組已關閉');
            router.back();
          },
        },
      ]
    );
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
        <Text style={styles.headerTitle}>{group.name}</Text>
        <TouchableOpacity
          style={styles.moreButton}
          onPress={handleShareGroupId}
        >
          <Text style={styles.moreIcon}>⋮</Text>
        </TouchableOpacity>
      </View>

      {/* Group Info Card */}
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>群組 ID</Text>
          <TouchableOpacity onPress={handleShareGroupId}>
            <Text style={styles.infoValue}>{id} 📋</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>成員數</Text>
          <Text style={styles.infoValue}>{group.members.length} 人</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>創建時間</Text>
          <Text style={styles.infoValue}>
            {new Date(group.createdAt).toLocaleDateString('zh-TW')}
          </Text>
        </View>
        {isHoster && (
          <View style={styles.hosterBadge}>
            <Text style={styles.hosterText}>👑 你是主辦人</Text>
          </View>
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'expenses' && styles.tabActive]}
          onPress={() => setActiveTab('expenses')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'expenses' && styles.tabTextActive,
            ]}
          >
            帳款 ({expenses.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'members' && styles.tabActive]}
          onPress={() => setActiveTab('members')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'members' && styles.tabTextActive,
            ]}
          >
            成員 ({group.members.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'expenses' ? (
          <>
            {/* Create Expense Button */}
            {isHoster && (
              <TouchableOpacity
                style={styles.createExpenseButton}
                onPress={handleCreateExpense}
              >
                <Text style={styles.createExpenseIcon}>➕</Text>
                <Text style={styles.createExpenseText}>創建新帳款</Text>
              </TouchableOpacity>
            )}

            {/* Expenses List */}
            {expenses.length > 0 ? (
              expenses.map((expense) => (
                <TouchableOpacity
                  key={expense.id}
                  style={styles.expenseCard}
                  onPress={() => router.push(`/expenseDetail?id=${expense.id}`)}
                >
                  <View style={styles.expenseHeader}>
                    <Text style={styles.expenseTitle}>
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

                  <Text style={styles.expenseAmount}>
                    $ {expense.totalAmount}
                  </Text>

                  <View style={styles.expenseFooter}>
                    <Text style={styles.expensePayer}>
                      付款人: {expense.payer === CURRENT_USER ? '你' : expense.participants.find(p => p.address === expense.payer)?.name}
                    </Text>
                    <Text style={styles.expenseDate}>
                      {new Date(expense.createdAt).toLocaleDateString('zh-TW')}
                    </Text>
                  </View>

                  {/* Payment Status */}
                  <View style={styles.paymentStatus}>
                    <Text style={styles.paymentStatusText}>
                      已付款: {expense.participants.filter((p) => p.paid).length}/
                      {expense.participants.length}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>📝</Text>
                <Text style={styles.emptyText}>還沒有帳款</Text>
                {isHoster && (
                  <Text style={styles.emptySubtext}>
                    點擊上方按鈕創建第一筆帳款
                  </Text>
                )}
              </View>
            )}
          </>
        ) : (
          /* Members List */
          <>
            {group.members.map((member) => (
              <View key={member.address} style={styles.memberCard}>
                <View style={styles.memberInfo}>
                  <View style={styles.memberAvatar}>
                    <Text style={styles.memberAvatarText}>
                      {member.name[0]}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.memberName}>{member.name}</Text>
                    <Text style={styles.memberAddress} numberOfLines={1}>
                      {member.address.slice(0, 8)}...{member.address.slice(-8)}
                    </Text>
                  </View>
                </View>

                <View style={styles.memberActions}>
                  {group.hoster === member.address && (
                    <View style={styles.memberHosterBadge}>
                      <Text style={styles.memberHosterText}>👑 主辦人</Text>
                    </View>
                  )}
                  {member.address === CURRENT_USER && (
                    <View style={styles.memberYouBadge}>
                      <Text style={styles.memberYouText}>你</Text>
                    </View>
                  )}
                  {isHoster &&
                    member.address !== CURRENT_USER &&
                    group.hoster !== member.address && (
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => handleRemoveMember(member.address)}
                      >
                        <Text style={styles.removeButtonText}>移除</Text>
                      </TouchableOpacity>
                    )}
                </View>
              </View>
            ))}
          </>
        )}

        {/* Close Group Button (Hoster Only) */}
        {isHoster && (
          <TouchableOpacity
            style={styles.closeGroupButton}
            onPress={handleCloseGroup}
          >
            <Text style={styles.closeGroupButtonText}>關閉群組</Text>
          </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
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
  headerTitle: {
    fontSize: SIZES.xLarge,
    fontWeight: '700',
    color: COLORS.black,
    flex: 1,
    textAlign: 'center',
  },
  moreButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreIcon: {
    fontSize: 24,
    color: COLORS.black,
  },
  infoCard: {
    backgroundColor: COLORS.white,
    margin: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  infoValue: {
    fontSize: SIZES.small,
    fontWeight: '600',
    color: COLORS.black,
  },
  hosterBadge: {
    backgroundColor: COLORS.gold + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  hosterText: {
    fontSize: SIZES.small,
    color: COLORS.gold,
    fontWeight: '600',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray || '#E0E0E0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: COLORS.gold,
  },
  tabText: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    fontWeight: '500',
  },
  tabTextActive: {
    color: COLORS.gold,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  createExpenseButton: {
    backgroundColor: COLORS.gold,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  createExpenseIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  createExpenseText: {
    fontSize: SIZES.medium,
    fontWeight: '700',
    color: COLORS.white,
  },
  expenseCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  expenseTitle: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    color: COLORS.black,
    flex: 1,
  },
  statusBadge: {
    backgroundColor: '#FFA726',
    paddingHorizontal: 10,
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
  expenseAmount: {
    fontSize: SIZES.xLarge,
    fontWeight: '700',
    color: COLORS.gold,
    marginBottom: 8,
  },
  expenseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  expensePayer: {
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  expenseDate: {
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  paymentStatus: {
    backgroundColor: COLORS.backGround || '#F5F5F5',
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
  },
  paymentStatusText: {
    fontSize: SIZES.small,
    color: COLORS.darkgray,
    textAlign: 'center',
  },
  memberCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  memberAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.gold,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  memberAvatarText: {
    fontSize: SIZES.large,
    fontWeight: '700',
    color: COLORS.white,
  },
  memberName: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 4,
  },
  memberAddress: {
    fontSize: SIZES.xSmall,
    color: COLORS.gray,
    maxWidth: 180,
  },
  memberActions: {
    flexDirection: 'row',
    gap: 8,
  },
  memberHosterBadge: {
    backgroundColor: COLORS.gold + '20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  memberHosterText: {
    fontSize: SIZES.xSmall,
    color: COLORS.gold,
    fontWeight: '600',
  },
  memberYouBadge: {
    backgroundColor: '#2196F3' + '20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  memberYouText: {
    fontSize: SIZES.xSmall,
    color: '#2196F3',
    fontWeight: '600',
  },
  removeButton: {
    backgroundColor: '#F44336',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  removeButtonText: {
    fontSize: SIZES.xSmall,
    color: COLORS.white,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: SIZES.large,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    textAlign: 'center',
  },
  closeGroupButton: {
    backgroundColor: '#F44336',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  closeGroupButtonText: {
    fontSize: SIZES.medium,
    fontWeight: '700',
    color: COLORS.white,
  },
  errorText: {
    fontSize: SIZES.large,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 40,
  },
});

export default GroupDetail;
