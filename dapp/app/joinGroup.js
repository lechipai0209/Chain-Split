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
import { useRouter } from 'expo-router';
import { COLORS, SIZES } from '../constants';

/**
 * 加入群組頁面
 */
const JoinGroup = () => {
  const router = useRouter();
  const [groupId, setGroupId] = useState('');

  const handleJoin = () => {
    if (!groupId.trim()) {
      Alert.alert('提示', '請輸入群組 ID');
      return;
    }

    // 模擬加入群組
    Alert.alert(
      '成功',
      `已加入群組！\n群組 ID: ${groupId}`,
      [
        {
          text: '確定',
          onPress: () => router.back(),
        },
      ]
    );
  };

  const handlePaste = async () => {
    // 模擬從剪貼板粘貼
    // 實際應使用 Clipboard.getString()
    const mockGroupId = 'group_001';
    setGroupId(mockGroupId);
    Alert.alert('提示', '已從剪貼板粘貼群組 ID');
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
        <Text style={styles.headerTitle}>加入群組</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>🔗</Text>
          <Text style={styles.infoText}>
            輸入朋友分享的群組 ID，即可加入群組並開始分帳
          </Text>
        </View>

        {/* Illustration */}
        <View style={styles.illustrationContainer}>
          <Text style={styles.illustrationIcon}>👥</Text>
          <Text style={styles.illustrationText}>輸入群組 ID</Text>
          <Text style={styles.arrow}>↓</Text>
          <Text style={styles.illustrationIcon}>✅</Text>
          <Text style={styles.illustrationText}>加入成功</Text>
        </View>

        {/* Group ID Input */}
        <View style={styles.section}>
          <Text style={styles.label}>群組 ID *</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="例如：group_001"
              placeholderTextColor={COLORS.gray}
              value={groupId}
              onChangeText={setGroupId}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.pasteButton}
              onPress={handlePaste}
            >
              <Text style={styles.pasteButtonText}>貼上</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Join Button */}
        <TouchableOpacity
          style={[
            styles.joinButton,
            !groupId.trim() && styles.joinButtonDisabled,
          ]}
          onPress={handleJoin}
          disabled={!groupId.trim()}
        >
          <Text style={styles.joinButtonText}>加入群組</Text>
        </TouchableOpacity>

        {/* How to Get Group ID */}
        <View style={styles.howToCard}>
          <Text style={styles.howToTitle}>📝 如何獲取群組 ID？</Text>
          <Text style={styles.howToStep}>1. 請朋友開啟群組詳情頁</Text>
          <Text style={styles.howToStep}>2. 點擊「分享群組 ID」按鈕</Text>
          <Text style={styles.howToStep}>3. 將 ID 複製後傳送給你</Text>
          <Text style={styles.howToStep}>4. 在此頁面輸入即可加入</Text>
        </View>

        {/* Note */}
        <View style={styles.noteCard}>
          <Text style={styles.noteIcon}>⚠️</Text>
          <Text style={styles.noteText}>
            加入群組後，群組主辦人可以創建帳款，你需要確認並支付相關費用
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
  infoCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  infoIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: SIZES.small,
    color: '#2E7D32',
    lineHeight: 20,
  },
  illustrationContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  illustrationIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  illustrationText: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    color: COLORS.black,
  },
  arrow: {
    fontSize: 32,
    color: COLORS.gold,
    marginVertical: 8,
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
  inputContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    fontSize: SIZES.medium,
    color: COLORS.black,
    borderWidth: 1,
    borderColor: COLORS.lightGray || '#E0E0E0',
  },
  pasteButton: {
    backgroundColor: COLORS.gold,
    borderRadius: 12,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pasteButtonText: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    color: COLORS.white,
  },
  joinButton: {
    backgroundColor: COLORS.gold,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginBottom: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  joinButtonDisabled: {
    backgroundColor: COLORS.gray,
    opacity: 0.5,
  },
  joinButtonText: {
    fontSize: SIZES.large,
    fontWeight: '700',
    color: COLORS.white,
  },
  howToCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  howToTitle: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 12,
  },
  howToStep: {
    fontSize: SIZES.small,
    color: COLORS.darkgray,
    marginBottom: 8,
    lineHeight: 20,
  },
  noteCard: {
    backgroundColor: '#FFF3CD',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  noteIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  noteText: {
    flex: 1,
    fontSize: SIZES.small,
    color: '#856404',
    lineHeight: 20,
  },
});

export default JoinGroup;
