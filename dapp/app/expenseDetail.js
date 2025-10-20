import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { COLORS, SIZES } from '../constants';
import { getExpenseById, CURRENT_USER, isUserPayer } from '../data/mockData';

/**
 * 帳款詳情頁面
 * 顯示帳款詳細資訊和付款狀態
 * 根據用戶角色顯示不同的操作按鈕
 */
const ExpenseDetail = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const expense = getExpenseById(id);

  if (!expense) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>帳款不存在</Text>
      </SafeAreaView>
    );
  }

  const isPayer = isUserPayer(id, CURRENT_USER);
  const currentUserParticipant = expense.participants.find(
    (p) => p.address === CURRENT_USER
  );
  const isMember = !!currentUserParticipant;
  const allPaid = expense.participants.every((p) => p.paid);
  const paidCount = expense.participants.filter((p) => p.paid).length;

  // Payer 操作
  const handleCloseExpense = () => {
    Alert.alert(
      '確認關閉帳款',
      '關閉後此帳款將被刪除且無法恢復',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '確認關閉',
          style: 'destructive',
          onPress: () => {
            Alert.alert('成功', '帳款已關閉');
            router.back();
          },
        },
      ]
    );
  };

  const handleFinalizeExpense = () => {
    if (!allPaid) {
      Alert.alert('提示', '還有成員未付款，無法結清帳款');
      return;
    }
    Alert.alert('確認結清', '確定要結清此帳款嗎？結清後將記錄到群組帳戶', [
      { text: '取消', style: 'cancel' },
      {
        text: '確認結清',
        onPress: () => {
          Alert.alert('成功', '帳款已結清並記錄到群組帳戶');
          router.back();
        },
      },
    ]);
  };

  const handleConfirmUsdPayment = (participantAddress) => {
    Alert.alert(
      '確認收到現金',
      '確認已收到此成員的 USD 現金付款？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '確認',
          onPress: () => {
            Alert.alert('成功', 'USD 付款已確認');
          },
        },
      ]
    );
  };

  // Member 操作
  const handleSignExpense = () => {
    if (currentUserParticipant?.paid) {
      Alert.alert('提示', '你已經確認過此帳款了');
      return;
    }
    Alert.alert('確認付款', '確定要確認此帳款並標記為已付款？', [
      { text: '取消', style: 'cancel' },
      {
        text: '確認',
        onPress: () => {
          Alert.alert('成功', '已確認付款');
        },
      },
    ]);
  };

  const handlePayWithUsd = () => {
    router.push(`/usdPayment?expenseId=${id}`);
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
        <Text style={styles.headerTitle}>帳款詳情</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Badge */}
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusBadge,
              expense.status === 'finalized' && styles.statusFinalized,
              expense.status === 'completed' && styles.statusCompleted,
            ]}
          >
            <Text style={styles.statusText}>
              {expense.status === 'pending' && '⏳ 進行中'}
              {expense.status === 'completed' && '✅ 已完成'}
              {expense.status === 'finalized' && '🎉 已結清'}
            </Text>
          </View>
        </View>

        {/* Expense Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.description}>{expense.description}</Text>
          <Text style={styles.amount}>$ {expense.totalAmount}</Text>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>群組</Text>
            <Text style={styles.infoValue}>{expense.groupName}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>付款人</Text>
            <Text style={styles.infoValue}>
              {expense.payer === CURRENT_USER
                ? '你'
                : expense.participants.find((p) => p.address === expense.payer)
                    ?.name}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>創建時間</Text>
            <Text style={styles.infoValue}>
              {new Date(expense.createdAt).toLocaleString('zh-TW')}
            </Text>
          </View>
        </View>

        {/* Payment Progress */}
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>付款進度</Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${
                    (paidCount / expense.participants.length) * 100
                  }%`,
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {paidCount} / {expense.participants.length} 人已付款
          </Text>
        </View>

        {/* Participants List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>參與者明細</Text>

          {expense.participants.map((participant) => (
            <View key={participant.address} style={styles.participantCard}>
              <View style={styles.participantInfo}>
                <View style={styles.participantAvatar}>
                  <Text style={styles.participantAvatarText}>
                    {participant.name[0]}
                  </Text>
                </View>
                <View style={styles.participantDetails}>
                  <View style={styles.participantNameRow}>
                    <Text style={styles.participantName}>
                      {participant.name}
                    </Text>
                    {participant.address === CURRENT_USER && (
                      <View style={styles.youBadge}>
                        <Text style={styles.youText}>你</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.participantAmount}>
                    $ {participant.amount}
                  </Text>
                  {participant.signedAt && (
                    <Text style={styles.participantSignedTime}>
                      確認時間:{' '}
                      {new Date(participant.signedAt).toLocaleString('zh-TW')}
                    </Text>
                  )}
                </View>
              </View>

              <View style={styles.participantStatus}>
                {participant.paid ? (
                  <View style={styles.paidBadge}>
                    <Text style={styles.paidText}>✓ 已付款</Text>
                  </View>
                ) : (
                  <View style={styles.unpaidBadge}>
                    <Text style={styles.unpaidText}>⏳ 待付款</Text>
                  </View>
                )}

                {/* Payer 可以確認 USD 付款 */}
                {isPayer && !participant.paid && (
                  <TouchableOpacity
                    style={styles.confirmUsdButton}
                    onPress={() => handleConfirmUsdPayment(participant.address)}
                  >
                    <Text style={styles.confirmUsdText}>確認 USD</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          {isMember && !isPayer && (
            <>
              {/* Member 操作按鈕 */}
              {!currentUserParticipant?.paid && (
                <>
                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={handleSignExpense}
                  >
                    <Text style={styles.primaryButtonText}>
                      ✓ 確認付款 (Crypto)
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={handlePayWithUsd}
                  >
                    <Text style={styles.secondaryButtonText}>
                      💵 使用 USD 現金支付
                    </Text>
                  </TouchableOpacity>
                </>
              )}

              {currentUserParticipant?.paid && (
                <View style={styles.alreadyPaidCard}>
                  <Text style={styles.alreadyPaidIcon}>✅</Text>
                  <Text style={styles.alreadyPaidText}>你已完成付款</Text>
                </View>
              )}
            </>
          )}

          {isPayer && (
            <>
              {/* Payer 操作按鈕 */}
              {expense.status === 'pending' && (
                <>
                  {allPaid && (
                    <TouchableOpacity
                      style={styles.finalizeButton}
                      onPress={handleFinalizeExpense}
                    >
                      <Text style={styles.finalizeButtonText}>
                        🎉 結清帳款
                      </Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    style={styles.dangerButton}
                    onPress={handleCloseExpense}
                  >
                    <Text style={styles.dangerButtonText}>關閉帳款</Text>
                  </TouchableOpacity>
                </>
              )}

              {expense.status !== 'pending' && (
                <View style={styles.infoNotice}>
                  <Text style={styles.infoNoticeIcon}>ℹ️</Text>
                  <Text style={styles.infoNoticeText}>
                    此帳款已{expense.status === 'finalized' ? '結清' : '完成'}
                    ，無法再進行操作
                  </Text>
                </View>
              )}
            </>
          )}
        </View>

        {/* Help Info */}
        <View style={styles.helpCard}>
          <Text style={styles.helpTitle}>💡 說明</Text>
          {isPayer ? (
            <>
              <Text style={styles.helpText}>
                • 等待所有參與者確認付款
              </Text>
              <Text style={styles.helpText}>
                • 可以確認成員的 USD 現金付款
              </Text>
              <Text style={styles.helpText}>
                • 所有人付款後可以結清帳款
              </Text>
              <Text style={styles.helpText}>
                • 可以隨時關閉此帳款（不可恢復）
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.helpText}>
                • 使用 Crypto 付款需要確認簽章
              </Text>
              <Text style={styles.helpText}>
                • 使用 USD 現金需要付款人確認
              </Text>
              <Text style={styles.helpText}>
                • 確認後無法取消，請謹慎操作
              </Text>
            </>
          )}
        </View>
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
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  statusBadge: {
    backgroundColor: '#FFA726',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusCompleted: {
    backgroundColor: '#66BB6A',
  },
  statusFinalized: {
    backgroundColor: '#9C27B0',
  },
  statusText: {
    fontSize: SIZES.medium,
    color: COLORS.white,
    fontWeight: '700',
  },
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  description: {
    fontSize: SIZES.xLarge,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 8,
  },
  amount: {
    fontSize: SIZES.xxLarge,
    fontWeight: '700',
    color: COLORS.gold,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.lightGray || '#E0E0E0',
    marginVertical: 16,
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
  progressCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  progressTitle: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.lightGray || '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.gold,
  },
  progressText: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    textAlign: 'center',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: SIZES.large,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 12,
  },
  participantCard: {
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
  participantInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  participantAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.gold,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  participantAvatarText: {
    fontSize: SIZES.large,
    fontWeight: '700',
    color: COLORS.white,
  },
  participantDetails: {
    flex: 1,
  },
  participantNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  participantName: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    color: COLORS.black,
    marginRight: 8,
  },
  youBadge: {
    backgroundColor: '#2196F3' + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  youText: {
    fontSize: SIZES.xSmall,
    color: '#2196F3',
    fontWeight: '600',
  },
  participantAmount: {
    fontSize: SIZES.large,
    fontWeight: '700',
    color: COLORS.gold,
    marginBottom: 4,
  },
  participantSignedTime: {
    fontSize: SIZES.xSmall,
    color: COLORS.gray,
  },
  participantStatus: {
    alignItems: 'flex-end',
  },
  paidBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  paidText: {
    fontSize: SIZES.small,
    color: COLORS.white,
    fontWeight: '600',
  },
  unpaidBadge: {
    backgroundColor: '#FFA726',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  unpaidText: {
    fontSize: SIZES.small,
    color: COLORS.white,
    fontWeight: '600',
  },
  confirmUsdButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 8,
  },
  confirmUsdText: {
    fontSize: SIZES.xSmall,
    color: COLORS.white,
    fontWeight: '600',
  },
  actionsSection: {
    marginVertical: 16,
  },
  primaryButton: {
    backgroundColor: COLORS.gold,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  primaryButtonText: {
    fontSize: SIZES.large,
    fontWeight: '700',
    color: COLORS.white,
  },
  secondaryButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  secondaryButtonText: {
    fontSize: SIZES.large,
    fontWeight: '700',
    color: COLORS.white,
  },
  finalizeButton: {
    backgroundColor: '#9C27B0',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  finalizeButtonText: {
    fontSize: SIZES.large,
    fontWeight: '700',
    color: COLORS.white,
  },
  dangerButton: {
    backgroundColor: '#F44336',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  dangerButtonText: {
    fontSize: SIZES.large,
    fontWeight: '700',
    color: COLORS.white,
  },
  alreadyPaidCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  alreadyPaidIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  alreadyPaidText: {
    fontSize: SIZES.large,
    fontWeight: '600',
    color: '#2E7D32',
  },
  infoNotice: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  infoNoticeIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  infoNoticeText: {
    flex: 1,
    fontSize: SIZES.small,
    color: '#1565C0',
    lineHeight: 20,
  },
  helpCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.gold,
  },
  helpTitle: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 12,
  },
  helpText: {
    fontSize: SIZES.small,
    color: COLORS.darkgray,
    marginBottom: 6,
    lineHeight: 20,
  },
  errorText: {
    fontSize: SIZES.large,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 40,
  },
});

export default ExpenseDetail;
