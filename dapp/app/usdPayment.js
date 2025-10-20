import React, { useState } from 'react';
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
import { getExpenseById, CURRENT_USER } from '../data/mockData';

/**
 * USD 支付頁面
 * Member 使用 USD 現金支付，需要 payer 確認
 */
const UsdPayment = () => {
  const router = useRouter();
  const { expenseId } = useLocalSearchParams();
  const expense = getExpenseById(expenseId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!expense) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>帳款不存在</Text>
      </SafeAreaView>
    );
  }

  const currentUserParticipant = expense.participants.find(
    (p) => p.address === CURRENT_USER
  );

  if (!currentUserParticipant) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>你不是此帳款的參與者</Text>
      </SafeAreaView>
    );
  }

  const payerName = expense.participants.find(
    (p) => p.address === expense.payer
  )?.name;

  const handleCreatePayment = () => {
    setIsSubmitting(true);

    // 模擬創建 USD 支付帳戶
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        '支付請求已發送',
        `請等待 ${payerName} 確認收到現金後，你的付款狀態將更新為已付款`,
        [
          {
            text: '確定',
            onPress: () => router.back(),
          },
        ]
      );
    }, 1000);
  };

  const handleCancel = () => {
    Alert.alert('取消支付', '確定要取消此次 USD 支付嗎？', [
      { text: '繼續支付', style: 'cancel' },
      {
        text: '確定取消',
        style: 'destructive',
        onPress: () => router.back(),
      },
    ]);
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
        <Text style={styles.headerTitle}>USD 現金支付</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Illustration */}
        <View style={styles.illustrationContainer}>
          <Text style={styles.illustrationIcon}>💵</Text>
          <Text style={styles.illustrationTitle}>使用實體現金支付</Text>
          <Text style={styles.illustrationSubtitle}>
            請將現金交給付款人，並建立支付請求
          </Text>
        </View>

        {/* Payment Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>支付資訊</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>帳款描述</Text>
            <Text style={styles.infoValue}>{expense.description}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>群組</Text>
            <Text style={styles.infoValue}>{expense.groupName}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>應付金額</Text>
            <Text style={styles.amountValue}>
              $ {currentUserParticipant.amount}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>付款人（收款方）</Text>
            <Text style={styles.payerValue}>{payerName}</Text>
          </View>
        </View>

        {/* Process Steps */}
        <View style={styles.stepsCard}>
          <Text style={styles.stepsTitle}>📋 支付流程</Text>

          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>準備現金</Text>
              <Text style={styles.stepDescription}>
                準備 $ {currentUserParticipant.amount} 實體現金
              </Text>
            </View>
          </View>

          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>交付現金給付款人</Text>
              <Text style={styles.stepDescription}>
                將現金當面交給 {payerName}
              </Text>
            </View>
          </View>

          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>建立支付請求</Text>
              <Text style={styles.stepDescription}>
                點擊下方按鈕建立 USD 支付請求
              </Text>
            </View>
          </View>

          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>4</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>等待確認</Text>
              <Text style={styles.stepDescription}>
                等待 {payerName} 確認收到現金
              </Text>
            </View>
          </View>

          <View style={styles.step}>
            <View style={[styles.stepNumber, styles.stepNumberFinal]}>
              <Text style={styles.stepNumberText}>✓</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>完成支付</Text>
              <Text style={styles.stepDescription}>
                確認後你的付款狀態將更新為已付款
              </Text>
            </View>
          </View>
        </View>

        {/* Warning Card */}
        <View style={styles.warningCard}>
          <Text style={styles.warningIcon}>⚠️</Text>
          <View style={styles.warningContent}>
            <Text style={styles.warningTitle}>重要提醒</Text>
            <Text style={styles.warningText}>
              • 請確保已將現金交給付款人本人
            </Text>
            <Text style={styles.warningText}>
              • 建議當面交付並確認金額無誤
            </Text>
            <Text style={styles.warningText}>
              • 如果付款人長時間未確認，請主動聯繫
            </Text>
            <Text style={styles.warningText}>
              • 建立請求後可以隨時取消
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.createButton, isSubmitting && styles.buttonDisabled]}
            onPress={handleCreatePayment}
            disabled={isSubmitting}
          >
            <Text style={styles.createButtonText}>
              {isSubmitting ? '處理中...' : '✓ 建立支付請求'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancel}
            disabled={isSubmitting}
          >
            <Text style={styles.cancelButtonText}>取消</Text>
          </TouchableOpacity>
        </View>

        {/* Info Note */}
        <View style={styles.noteCard}>
          <Text style={styles.noteIcon}>💡</Text>
          <Text style={styles.noteText}>
            使用 USD 現金支付可以避免區塊鏈手續費，但需要付款人手動確認。如果你希望自動確認，可以選擇使用
            Crypto 支付。
          </Text>
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
    padding: 20,
  },
  illustrationContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  illustrationIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  illustrationTitle: {
    fontSize: SIZES.xLarge,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 8,
  },
  illustrationSubtitle: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoTitle: {
    fontSize: SIZES.large,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    flex: 1,
  },
  infoValue: {
    fontSize: SIZES.small,
    fontWeight: '600',
    color: COLORS.black,
    flex: 1,
    textAlign: 'right',
  },
  amountValue: {
    fontSize: SIZES.xLarge,
    fontWeight: '700',
    color: COLORS.gold,
  },
  payerValue: {
    fontSize: SIZES.medium,
    fontWeight: '700',
    color: COLORS.gold,
    flex: 1,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.lightGray || '#E0E0E0',
    marginVertical: 16,
  },
  stepsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  stepsTitle: {
    fontSize: SIZES.large,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 20,
  },
  step: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.gold,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberFinal: {
    backgroundColor: '#4CAF50',
  },
  stepNumberText: {
    fontSize: SIZES.medium,
    fontWeight: '700',
    color: COLORS.white,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    lineHeight: 20,
  },
  warningCard: {
    backgroundColor: '#FFF3CD',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  warningIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: SIZES.medium,
    fontWeight: '700',
    color: '#856404',
    marginBottom: 8,
  },
  warningText: {
    fontSize: SIZES.small,
    color: '#856404',
    marginBottom: 4,
    lineHeight: 20,
  },
  actionsContainer: {
    marginBottom: 20,
  },
  createButton: {
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
  buttonDisabled: {
    backgroundColor: COLORS.gray,
    opacity: 0.6,
  },
  createButtonText: {
    fontSize: SIZES.large,
    fontWeight: '700',
    color: COLORS.white,
  },
  cancelButton: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.gray,
  },
  cancelButtonText: {
    fontSize: SIZES.large,
    fontWeight: '700',
    color: COLORS.gray,
  },
  noteCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  noteIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  noteText: {
    flex: 1,
    fontSize: SIZES.small,
    color: '#1565C0',
    lineHeight: 20,
  },
  errorText: {
    fontSize: SIZES.large,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 40,
  },
});

export default UsdPayment;
