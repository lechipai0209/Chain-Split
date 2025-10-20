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
 * 創建群組頁面
 */
const CreateGroup = () => {
  const router = useRouter();
  const [groupName, setGroupName] = useState('');
  const [groupIcon, setGroupIcon] = useState('👥');

  const icons = ['👥', '🍕', '🏠', '✈️', '🎉', '💼', '🏖️', '🎮', '📚', '🎬'];

  const handleCreate = () => {
    if (!groupName.trim()) {
      Alert.alert('提示', '請輸入群組名稱');
      return;
    }

    // 模擬創建群組
    Alert.alert(
      '成功',
      `群組 "${groupIcon} ${groupName}" 已創建！`,
      [
        {
          text: '確定',
          onPress: () => router.back(),
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
        <Text style={styles.headerTitle}>創建群組</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={styles.infoText}>
            創建群組後，你將成為群組主辦人，可以管理成員和帳款
          </Text>
        </View>

        {/* Group Icon Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>選擇圖標</Text>
          <View style={styles.iconGrid}>
            {icons.map((icon) => (
              <TouchableOpacity
                key={icon}
                style={[
                  styles.iconButton,
                  groupIcon === icon && styles.iconButtonActive,
                ]}
                onPress={() => setGroupIcon(icon)}
              >
                <Text style={styles.iconText}>{icon}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Group Name Input */}
        <View style={styles.section}>
          <Text style={styles.label}>群組名稱 *</Text>
          <TextInput
            style={styles.input}
            placeholder="例如：週末聚餐、室友分帳"
            placeholderTextColor={COLORS.gray}
            value={groupName}
            onChangeText={setGroupName}
            maxLength={30}
          />
          <Text style={styles.charCount}>{groupName.length}/30</Text>
        </View>

        {/* Preview */}
        {groupName && (
          <View style={styles.previewSection}>
            <Text style={styles.previewLabel}>預覽</Text>
            <View style={styles.previewCard}>
              <Text style={styles.previewIcon}>{groupIcon}</Text>
              <Text style={styles.previewName}>{groupName}</Text>
            </View>
          </View>
        )}

        {/* Create Button */}
        <TouchableOpacity
          style={[
            styles.createButton,
            !groupName.trim() && styles.createButtonDisabled,
          ]}
          onPress={handleCreate}
          disabled={!groupName.trim()}
        >
          <Text style={styles.createButtonText}>創建群組</Text>
        </TouchableOpacity>

        {/* Additional Info */}
        <View style={styles.noteCard}>
          <Text style={styles.noteTitle}>💡 小提示</Text>
          <Text style={styles.noteText}>• 群組創建後可以邀請成員加入</Text>
          <Text style={styles.noteText}>• 主辦人可以創建帳款並管理群組</Text>
          <Text style={styles.noteText}>• 群組 ID 可以分享給朋友加入</Text>
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
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 12,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  iconButton: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.lightGray || '#E0E0E0',
  },
  iconButtonActive: {
    borderColor: COLORS.gold,
    backgroundColor: COLORS.gold + '20',
  },
  iconText: {
    fontSize: 32,
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
  previewSection: {
    marginBottom: 24,
  },
  previewLabel: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 12,
  },
  previewCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  previewIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  previewName: {
    fontSize: SIZES.large,
    fontWeight: '700',
    color: COLORS.black,
  },
  createButton: {
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
  createButtonDisabled: {
    backgroundColor: COLORS.gray,
    opacity: 0.5,
  },
  createButtonText: {
    fontSize: SIZES.large,
    fontWeight: '700',
    color: COLORS.white,
  },
  noteCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.gold,
  },
  noteTitle: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 12,
  },
  noteText: {
    fontSize: SIZES.small,
    color: COLORS.darkgray,
    marginBottom: 6,
    lineHeight: 20,
  },
});

export default CreateGroup;
