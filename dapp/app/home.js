import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  RefreshControl,
  Animated,
  Dimensions,
  PanResponder,
  TouchableOpacity,
  Modal,
  TextInput,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS, SIZES } from '../constants';
import { getRecentTransactions, GROUPS, EXPENSES, CURRENT_USER } from '../data/mockData';
import TransactionCard from '../components/common/TransactionCard';
import GroupCard from '../components/common/GroupCard';
import FloatingActionButton from '../components/common/FloatingActionButton';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * 主頁面
 * 顯示交易訊息流和懸空按鈕
 * 可左滑查看群組列表
 */
const Home = () => {
  const router = useRouter();
  const [transactions] = useState(getRecentTransactions());
  const translateX = useRef(new Animated.Value(0)).current;
  const [user, setUser] = useState(null);

  // 篩選和排序狀態
  const [sortBy, setSortBy] = useState('time'); // time, name, updated
  const [filterStatus, setFilterStatus] = useState('all'); // all, active, closed
  const [showFilterModal, setShowFilterModal] = useState(false);

  // 日期篩選狀態
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  // 名稱搜尋狀態
  const [searchName, setSearchName] = useState('');

  // 從AsyncStorage加載保存的設定和用戶資訊
  useEffect(() => {
    loadSettings();
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      const userDataJson = await AsyncStorage.getItem('@user_data');
      if (userDataJson) {
        const userData = JSON.parse(userDataJson);
        setUser(userData);
      }
    } catch (error) {
      console.log('載入用戶資訊失敗:', error);
    }
  };

  // 當設定改變時保存到AsyncStorage
  useEffect(() => {
    saveSettings();
  }, [sortBy, filterStatus, searchName, startDate, endDate]);

  const loadSettings = async () => {
    try {
      const savedSortBy = await AsyncStorage.getItem('groupSortBy');
      const savedFilterStatus = await AsyncStorage.getItem('groupFilterStatus');
      const savedSearchName = await AsyncStorage.getItem('groupSearchName');
      const savedStartDate = await AsyncStorage.getItem('groupStartDate');
      const savedEndDate = await AsyncStorage.getItem('groupEndDate');

      if (savedSortBy) setSortBy(savedSortBy);
      if (savedFilterStatus) setFilterStatus(savedFilterStatus);
      if (savedSearchName) setSearchName(savedSearchName);
      if (savedStartDate) setStartDate(new Date(savedStartDate));
      if (savedEndDate) setEndDate(new Date(savedEndDate));
    } catch (error) {
      console.log('載入設定失敗:', error);
    }
  };

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem('groupSortBy', sortBy);
      await AsyncStorage.setItem('groupFilterStatus', filterStatus);
      await AsyncStorage.setItem('groupSearchName', searchName);
      await AsyncStorage.setItem('groupStartDate', startDate ? startDate.toISOString() : '');
      await AsyncStorage.setItem('groupEndDate', endDate ? endDate.toISOString() : '');
    } catch (error) {
      console.log('保存設定失敗:', error);
    }
  };

  // 篩選和排序群組
  const getFilteredAndSortedGroups = () => {
    let filtered = [...GROUPS];

    // 篩選狀態
    if (filterStatus === 'active') {
      filtered = filtered.filter(g => g.isActive);
    } else if (filterStatus === 'closed') {
      filtered = filtered.filter(g => !g.isActive);
    }

    // 篩選日期範圍
    if (startDate) {
      filtered = filtered.filter(g => new Date(g.createdAt) >= startDate);
    }
    if (endDate) {
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      filtered = filtered.filter(g => new Date(g.createdAt) <= endOfDay);
    }

    // 篩選名稱
    if (searchName.trim()) {
      filtered = filtered.filter(g =>
        g.name.toLowerCase().includes(searchName.toLowerCase().trim())
      );
    }

    // 排序
    if (sortBy === 'time') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'updated') {
      // 根據最近的expense時間排序
      filtered.sort((a, b) => {
        const aExpenses = EXPENSES.filter(e => e.groupId === a.id);
        const bExpenses = EXPENSES.filter(e => e.groupId === b.id);
        const aLatest = aExpenses.length > 0
          ? Math.max(...aExpenses.map(e => new Date(e.createdAt)))
          : new Date(a.createdAt);
        const bLatest = bExpenses.length > 0
          ? Math.max(...bExpenses.map(e => new Date(e.createdAt)))
          : new Date(b.createdAt);
        return bLatest - aLatest;
      });
    }

    return filtered;
  };

  const filteredGroups = getFilteredAndSortedGroups();

  // 自動滑動到群組頁
  const slideToGroups = () => {
    Animated.spring(translateX, {
      toValue: -SCREEN_WIDTH,
      useNativeDriver: true,
    }).start();
  };

  // 自動滑回主頁
  const slideToHome = () => {
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  // 左滑手勢處理
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 15;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          translateX.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -SCREEN_WIDTH * 0.3) {
          // 滑動超過 30% 就切換到群組頁
          Animated.spring(translateX, {
            toValue: -SCREEN_WIDTH,
            useNativeDriver: true,
          }).start();
        } else {
          // 否則回彈
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  // 從群組頁滑回來
  const groupPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 15;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx > 0) {
          translateX.setValue(-SCREEN_WIDTH + gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > SCREEN_WIDTH * 0.3) {
          // 滑動超過 30% 就回到主頁
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        } else {
          // 否則回到群組頁
          Animated.spring(translateX, {
            toValue: -SCREEN_WIDTH,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* 兩頁滑動容器 */}
      <Animated.View
        style={[
          styles.pagesContainer,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        {/* 主頁 - 交易列表 */}
        <View style={styles.page}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => router.push('/profileSettings')}
            >
              <Text style={styles.profileIcon}>👤</Text>
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>Chain Split</Text>
              <Text style={styles.headerSubtitle} numberOfLines={1}>
                {user ? (user.username || user.publicKey?.slice(0, 8) + '...' + user.publicKey?.slice(-8)) : CURRENT_USER.slice(0, 8) + '...' + CURRENT_USER.slice(-8)}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.arrowButton}
              onPress={slideToGroups}
              activeOpacity={0.7}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
              delayPressIn={0}
            >
              <Text style={styles.arrowIcon}>▶</Text>
            </TouchableOpacity>
          </View>

          {/* Summary Card */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>總覽</Text>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>待付款</Text>
                <Text style={styles.summaryValue}>$1,800</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>待收款</Text>
                <Text style={styles.summaryValuePositive}>$500</Text>
              </View>
            </View>
          </View>

          {/* Transactions List */}
          <View style={styles.transactionsContainer} {...panResponder.panHandlers}>
            <Text style={styles.sectionTitle}>最新交易</Text>
            <ScrollView
              style={styles.transactionsScrollView}
              contentContainerStyle={styles.transactionsContent}
              showsVerticalScrollIndicator={true}
            >
              {transactions.map((transaction) => (
                <TransactionCard key={transaction.id} transaction={transaction} />
              ))}
              <Text style={styles.middletitle}>沒有更多交易 ! </Text>
            </ScrollView>
          </View>
        </View>

        {/* 群組頁面 */}
        <View style={styles.page}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.arrowButton}
              onPress={slideToHome}
              activeOpacity={0.7}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
              delayPressIn={0}
            >
              <Text style={styles.arrowIcon}>◀</Text>
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>我的群組</Text>
              <Text style={styles.headerSubtitle}>{filteredGroups.length} 個群組</Text>
            </View>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setShowFilterModal(true)}
            >
              <Text style={styles.filterIcon}>🔍</Text>
            </TouchableOpacity>
          </View>

          {/* Filter Status Bar */}
          <View style={styles.filterStatusBar}>
            <Text style={styles.filterStatusText}>
              排序: {sortBy === 'time' ? '創建時間' : sortBy === 'name' ? '名稱' : '最近更新'}
              {' • '}
              狀態: {filterStatus === 'all' ? '全部' : filterStatus === 'active' ? '活躍' : '已關閉'}
              {searchName && ` • 搜尋: "${searchName}"`}
              {(startDate || endDate) && ` • 日期: ${startDate ? startDate.toLocaleDateString('zh-TW') : '不限'} ~ ${endDate ? endDate.toLocaleDateString('zh-TW') : '不限'}`}
            </Text>
            {(searchName || startDate || endDate) && (
              <TouchableOpacity
                style={styles.resetFiltersButton}
                onPress={() => {
                  setSearchName('');
                  setStartDate(null);
                  setEndDate(null);
                }}
              >
                <Text style={styles.resetFiltersText}>重置</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Groups List */}
          <View style={{flex: 1}} {...groupPanResponder.panHandlers}>
            <ScrollView
              style={styles.groupsScrollView}
              contentContainerStyle={styles.groupsContent}
              showsVerticalScrollIndicator={true}
            >
              {filteredGroups.map((group) => (
                <GroupCard key={group.id} group={group} expenses={EXPENSES} />
              ))}
              {filteredGroups.length === 0 && (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyIcon}>📭</Text>
                  <Text style={styles.emptyText}>沒有符合條件的群組</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Animated.View>

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setShowFilterModal(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>群組篩選與排序</Text>

              {/* 名稱搜尋 */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>🔤 名稱搜尋</Text>
                <TextInput
                  style={styles.searchInput}
                  placeholder="輸入群組名稱關鍵字..."
                  placeholderTextColor={COLORS.gray}
                  value={searchName}
                  onChangeText={setSearchName}
                />
                {searchName.length > 0 && (
                  <TouchableOpacity
                    style={styles.clearButton}
                    onPress={() => setSearchName('')}
                  >
                    <Text style={styles.clearButtonText}>清除</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* 日期範圍篩選 */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>⏰ 創建時間範圍</Text>

                {/* 開始日期 */}
                <View style={styles.dateRow}>
                  <Text style={styles.dateLabel}>開始日期:</Text>
                  <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => setShowStartDatePicker(true)}
                  >
                    <Text style={styles.dateButtonText}>
                      {startDate ? startDate.toLocaleDateString('zh-TW') : '選擇日期'}
                    </Text>
                  </TouchableOpacity>
                  {startDate && (
                    <TouchableOpacity
                      style={styles.dateCloseButton}
                      onPress={() => setStartDate(null)}
                    >
                      <Text style={styles.dateCloseButtonText}>✕</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* 結束日期 */}
                <View style={styles.dateRow}>
                  <Text style={styles.dateLabel}>結束日期:</Text>
                  <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => setShowEndDatePicker(true)}
                  >
                    <Text style={styles.dateButtonText}>
                      {endDate ? endDate.toLocaleDateString('zh-TW') : '選擇日期'}
                    </Text>
                  </TouchableOpacity>
                  {endDate && (
                    <TouchableOpacity
                      style={styles.dateCloseButton}
                      onPress={() => setEndDate(null)}
                    >
                      <Text style={styles.dateCloseButtonText}>✕</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* 快速選擇 */}
                <View style={styles.quickDateButtons}>
                  <TouchableOpacity
                    style={styles.quickDateButton}
                    onPress={() => {
                      const today = new Date();
                      const lastWeek = new Date(today);
                      lastWeek.setDate(today.getDate() - 7);
                      setStartDate(lastWeek);
                      setEndDate(today);
                    }}
                  >
                    <Text style={styles.quickDateButtonText}>最近7天</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.quickDateButton}
                    onPress={() => {
                      const today = new Date();
                      const lastMonth = new Date(today);
                      lastMonth.setMonth(today.getMonth() - 1);
                      setStartDate(lastMonth);
                      setEndDate(today);
                    }}
                  >
                    <Text style={styles.quickDateButtonText}>最近30天</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.quickDateButton}
                    onPress={() => {
                      setStartDate(null);
                      setEndDate(null);
                    }}
                  >
                    <Text style={styles.quickDateButtonText}>清除日期</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* 狀態篩選 */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>群組狀態</Text>
                <TouchableOpacity
                  style={[styles.modalOption, filterStatus === 'all' && styles.modalOptionActive]}
                  onPress={() => setFilterStatus('all')}
                >
                  <Text style={[styles.modalOptionText, filterStatus === 'all' && styles.modalOptionTextActive]}>
                    📂 全部群組
                  </Text>
                  {filterStatus === 'all' && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalOption, filterStatus === 'active' && styles.modalOptionActive]}
                  onPress={() => setFilterStatus('active')}
                >
                  <Text style={[styles.modalOptionText, filterStatus === 'active' && styles.modalOptionTextActive]}>
                    ✅ 活躍群組
                  </Text>
                  {filterStatus === 'active' && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalOption, filterStatus === 'closed' && styles.modalOptionActive]}
                  onPress={() => setFilterStatus('closed')}
                >
                  <Text style={[styles.modalOptionText, filterStatus === 'closed' && styles.modalOptionTextActive]}>
                    🔒 已關閉群組
                  </Text>
                  {filterStatus === 'closed' && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
              </View>

              {/* 關閉按鈕 */}
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowFilterModal(false)}
              >
                <Text style={styles.modalCloseButtonText}>完成</Text>
              </TouchableOpacity>
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Date Pickers */}
      {showStartDatePicker && (
        <DateTimePicker
          value={startDate || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(_, selectedDate) => {
            setShowStartDatePicker(Platform.OS === 'ios');
            if (selectedDate) {
              setStartDate(selectedDate);
            }
          }}
        />
      )}

      {showEndDatePicker && (
        <DateTimePicker
          value={endDate || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(_, selectedDate) => {
            setShowEndDatePicker(Platform.OS === 'ios');
            if (selectedDate) {
              setEndDate(selectedDate);
            }
          }}
        />
      )}

      {/* Floating Action Button */}
      <FloatingActionButton />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backGround || '#F5F5F5',
  },
  pagesContainer: {
    flex: 1,
    flexDirection: 'row',
    width: SCREEN_WIDTH * 2,
  },
  page: {
    width: SCREEN_WIDTH,
    flex: 1,
  },
  header: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gold + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    fontSize: 20,
  },
  arrowButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.gold + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowIcon: {
    fontSize: 24,
    color: COLORS.gold,
    fontWeight: '900',
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
  summaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  summaryTitle: {
    fontSize: SIZES.medium,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryLabel: {
    fontSize: SIZES.xSmall,
    color: COLORS.gray,
    marginBottom: 6,
  },
  summaryValue: {
    fontSize: SIZES.medium,
    fontWeight: '700',
    color: '#FF5722',
  },
  summaryValuePositive: {
    fontSize: SIZES.medium,
    fontWeight: '700',
    color: '#4CAF50',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: COLORS.lightGray || '#E0E0E0',
  },
  transactionsContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  transactionsScrollView: {
    flex: 1,
  },
  transactionsContent: {
    paddingBottom: 120,
  },
  sectionTitle: {
    fontSize: SIZES.medium,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 12,
  },
  groupsScrollView: {
    flex: 1,
  },
  groupsContent: {
    padding: 16,
    paddingBottom: 140,
  },
  filterButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterIcon: {
    fontSize: 24,
  },
  filterStatusBar: {
    backgroundColor: COLORS.gold + '15',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray || '#E0E0E0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterStatusText: {
    fontSize: SIZES.xSmall,
    color: COLORS.gold,
    fontWeight: '600',
    flex: 1,
  },
  resetFiltersButton: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  resetFiltersText: {
    fontSize: SIZES.xSmall,
    color: COLORS.gold,
    fontWeight: '700',
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    width: SCREEN_WIDTH - 32,
    maxHeight: '85%',
  },
  modalTitle: {
    fontSize: SIZES.xLarge,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalSection: {
    marginBottom: 24,
  },
  modalSectionTitle: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 12,
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 10,
    backgroundColor: COLORS.backGround || '#F5F5F5',
    marginBottom: 8,
  },
  modalOptionActive: {
    backgroundColor: COLORS.gold + '20',
    borderWidth: 2,
    borderColor: COLORS.gold,
  },
  modalOptionText: {
    fontSize: SIZES.medium,
    color: COLORS.black,
    fontWeight: '500',
  },
  modalOptionTextActive: {
    color: COLORS.gold,
    fontWeight: '700',
  },
  checkmark: {
    fontSize: 20,
    color: COLORS.gold,
    fontWeight: 'bold',
  },
  modalCloseButton: {
    backgroundColor: COLORS.gold,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  modalCloseButtonText: {
    fontSize: SIZES.medium,
    fontWeight: '700',
    color: COLORS.white,
  },
  middletitle: {
    fontSize: SIZES.medium,
    fontWeight: '700',
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: COLORS.backGround || '#F5F5F5',
    borderRadius: 10,
    padding: 14,
    fontSize: SIZES.medium,
    color: COLORS.black,
    borderWidth: 1,
    borderColor: COLORS.lightGray || '#E0E0E0',
  },
  clearButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.gold + '20',
    borderRadius: 8,
  },
  clearButtonText: {
    fontSize: SIZES.small,
    color: COLORS.gold,
    fontWeight: '600',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  dateLabel: {
    fontSize: SIZES.medium,
    color: COLORS.black,
    fontWeight: '500',
    minWidth: 85,
  },
  dateButton: {
    flex: 1,
    backgroundColor: COLORS.backGround || '#F5F5F5',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.lightGray || '#E0E0E0',
  },
  dateButtonText: {
    fontSize: SIZES.medium,
    color: COLORS.black,
    fontWeight: '500',
  },
  dateCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.gold + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateCloseButtonText: {
    fontSize: 18,
    color: COLORS.gold,
    fontWeight: 'bold',
  },
  quickDateButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  quickDateButton: {
    flex: 1,
    backgroundColor: COLORS.gold + '15',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  quickDateButtonText: {
    fontSize: SIZES.xSmall,
    color: COLORS.gold,
    fontWeight: '600',
  },
});

export default Home;
