import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { COLORS, SIZES } from '../constants';
import { getGroupById } from '../data/mockData';

/**
 * 創建帳款頁面
 * Payer 可以創建新帳款並分配金額給成員
 */
const CreateExpense = () => {
  const router = useRouter();
  const { groupId } = useLocalSearchParams();
  const group = getGroupById(groupId);

  const [description, setDescription] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [splitType, setSplitType] = useState('equal'); // equal, custom
  const [participants, setParticipants] = useState(
    group?.members.map((member) => ({
      address: member.address,
      name: member.name,
      selected: true,
      amount: '',
    })) || []
  );

  if (!group) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>群組不存在</Text>
      </SafeAreaView>
    );
  }

  const handleToggleParticipant = (address) => {
    setParticipants((prev) =>
      prev.map((p) =>
        p.address === address ? { ...p, selected: !p.selected } : p
      )
    );
  };

  const handleAmountChange = (address, amount) => {
    setParticipants((prev) =>
      prev.map((p) => (p.address === address ? { ...p, amount } : p))
    );
  };

  const calculateSplit = () => {
    const total = parseFloat(totalAmount) || 0;
    const selectedParticipants = participants.filter((p) => p.selected);
    const perPerson = (total / selectedParticipants.length).toFixed(2);

    setParticipants((prev) =>
      prev.map((p) => ({
        ...p,
        amount: p.selected ? perPerson : '0',
      }))
    );
  };

  const handleCreate = () => {
    if (!description.trim()) {
      Alert.alert('提示', '請輸入帳款描述');
      return;
    }

    if (!totalAmount || parseFloat(totalAmount) <= 0) {
      Alert.alert('提示', '請輸入有效的總金額');
      return;
    }

    const selectedParticipants = participants.filter((p) => p.selected);
    if (selectedParticipants.length === 0) {
      Alert.alert('提示', '請至少選擇一位參與者');
      return;
    }

    // 驗證自定義金額總和
    if (splitType === 'custom') {
      const sum = selectedParticipants.reduce(
        (acc, p) => acc + (parseFloat(p.amount) || 0),
        0
      );
      if (Math.abs(sum - parseFloat(totalAmount)) > 0.01) {
        Alert.alert('提示', '參與者金額總和必須等於總金額');
        return;
      }
    }

    // 模擬創建帳款
    Alert.alert('成功', `帳款「${description}」已創建！`, [
      {
        text: '確定',
        onPress: () => router.back(),
      },
    ]);
  };

  const selectedCount = participants.filter((p) => p.selected).length;
  const customTotal = participants.reduce(
    (acc, p) => acc + (parseFloat(p.amount) || 0),
    0
  );

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
        <Text style={styles.headerTitle}>創建帳款</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Group Info */}
        <View style={styles.groupInfo}>
          <Text style={styles.groupLabel}>群組</Text>
          <Text style={styles.groupName}>{group.name}</Text>
        </View>

        {/* Description Input */}
        <View style={styles.section}>
          <Text style={styles.label}>帳款描述 *</Text>
          <TextInput
            style={styles.input}
            placeholder="例如：週末聚餐、電影票"
            placeholderTextColor={COLORS.gray}
            value={description}
            onChangeText={setDescription}
            maxLength={50}
          />
          <Text style={styles.charCount}>{description.length}/50</Text>
        </View>

        {/* Total Amount Input */}
        <View style={styles.section}>
          <Text style={styles.label}>總金額 ($) *</Text>
          <TextInput
            style={styles.input}
            placeholder="0"
            placeholderTextColor={COLORS.gray}
            value={totalAmount}
            onChangeText={setTotalAmount}
            keyboardType="decimal-pad"
          />
        </View>

        {/* Split Type */}
        <View style={styles.section}>
          <Text style={styles.label}>分帳方式</Text>
          <View style={styles.splitTypeContainer}>
            <TouchableOpacity
              style={[
                styles.splitTypeButton,
                splitType === 'equal' && styles.splitTypeButtonActive,
              ]}
              onPress={() => {
                setSplitType('equal');
                if (totalAmount) calculateSplit();
              }}
            >
              <Text
                style={[
                  styles.splitTypeText,
                  splitType === 'equal' && styles.splitTypeTextActive,
                ]}
              >
                平均分帳
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.splitTypeButton,
                splitType === 'custom' && styles.splitTypeButtonActive,
              ]}
              onPress={() => setSplitType('custom')}
            >
              <Text
                style={[
                  styles.splitTypeText,
                  splitType === 'custom' && styles.splitTypeTextActive,
                ]}
              >
                自定義金額
              </Text>
            </TouchableOpacity>
          </View>

          {splitType === 'equal' && totalAmount && (
            <TouchableOpacity
              style={styles.calculateButton}
              onPress={calculateSplit}
            >
              <Text style={styles.calculateButtonText}>重新計算分帳</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Participants */}
        <View style={styles.section}>
          <Text style={styles.label}>
            選擇參與者 ({selectedCount}/{participants.length})
          </Text>

          {participants.map((participant) => (
            <View key={participant.address} style={styles.participantCard}>
              <TouchableOpacity
                style={styles.participantCheckbox}
                onPress={() => handleToggleParticipant(participant.address)}
              >
                <View
                  style={[
                    styles.checkbox,
                    participant.selected && styles.checkboxChecked,
                  ]}
                >
                  {participant.selected && (
                    <Text style={styles.checkboxIcon}>✓</Text>
                  )}
                </View>
                <Text style={styles.participantName}>{participant.name}</Text>
              </TouchableOpacity>

              {participant.selected && (
                <View style={styles.amountInputContainer}>
                  <Text style={styles.currencySymbol}>$</Text>
                  <TextInput
                    style={styles.amountInput}
                    value={participant.amount}
                    onChangeText={(amount) =>
                      handleAmountChange(participant.address, amount)
                    }
                    keyboardType="decimal-pad"
                    editable={splitType === 'custom'}
                    placeholder="0"
                    placeholderTextColor={COLORS.gray}
                  />
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Summary */}
        {splitType === 'custom' && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>金額檢查</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>總金額</Text>
              <Text style={styles.summaryValue}>
                $ {parseFloat(totalAmount) || 0}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>已分配</Text>
              <Text
                style={[
                  styles.summaryValue,
                  Math.abs(customTotal - parseFloat(totalAmount)) > 0.01 &&
                    styles.summaryValueError,
                ]}
              >
                $ {customTotal.toFixed(2)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>差額</Text>
              <Text
                style={[
                  styles.summaryValue,
                  Math.abs(customTotal - parseFloat(totalAmount)) > 0.01 &&
                    styles.summaryValueError,
                ]}
              >
                $ {(parseFloat(totalAmount) - customTotal).toFixed(2)}
              </Text>
            </View>
          </View>
        )}

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={styles.infoText}>
            創建後，所有參與者將收到通知，需要確認並支付款項
          </Text>
        </View>

        {/* Create Button */}
        <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
          <Text style={styles.createButtonText}>創建帳款</Text>
        </TouchableOpacity>
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
  groupInfo: {
    backgroundColor: COLORS.gold + '20',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.gold,
  },
  groupLabel: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginBottom: 4,
  },
  groupName: {
    fontSize: SIZES.large,
    fontWeight: '700',
    color: COLORS.black,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 12,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    fontSize: SIZES.medium,
    color: COLORS.black,
    borderWidth: 1,
    borderColor: COLORS.lightGray || '#E0E0E0',
  },
  charCount: {
    fontSize: SIZES.xSmall,
    color: COLORS.gray,
    textAlign: 'right',
    marginTop: 4,
  },
  splitTypeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  splitTypeButton: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.lightGray || '#E0E0E0',
  },
  splitTypeButtonActive: {
    borderColor: COLORS.gold,
    backgroundColor: COLORS.gold + '20',
  },
  splitTypeText: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    color: COLORS.gray,
  },
  splitTypeTextActive: {
    color: COLORS.gold,
  },
  calculateButton: {
    backgroundColor: COLORS.gold,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  calculateButtonText: {
    fontSize: SIZES.small,
    fontWeight: '600',
    color: COLORS.white,
  },
  participantCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.lightGray || '#E0E0E0',
  },
  participantCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.gray,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.gold,
    borderColor: COLORS.gold,
  },
  checkboxIcon: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  participantName: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    color: COLORS.black,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backGround || '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  currencySymbol: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    color: COLORS.gray,
    marginRight: 4,
  },
  amountInput: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    color: COLORS.black,
    padding: 8,
    minWidth: 80,
    textAlign: 'right',
  },
  summaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.lightGray || '#E0E0E0',
  },
  summaryTitle: {
    fontSize: SIZES.medium,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  summaryValue: {
    fontSize: SIZES.small,
    fontWeight: '600',
    color: COLORS.black,
  },
  summaryValueError: {
    color: '#F44336',
  },
  infoCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  infoIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: SIZES.small,
    color: '#1565C0',
    lineHeight: 20,
  },
  createButton: {
    backgroundColor: COLORS.gold,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  createButtonText: {
    fontSize: SIZES.large,
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

export default CreateExpense;
