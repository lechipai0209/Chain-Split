import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { COLORS, SIZES } from '../constants';

/**
 * 個人資料設定頁面
 * 顯示設定選項：修改名稱、密鑰資訊、個人數據統計、登出帳號
 */
const ProfileSettings = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [originalUsername, setOriginalUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('@user_data');
      if (userData) {
        const parsed = JSON.parse(userData);
        setUsername(parsed.username || '');
        setOriginalUsername(parsed.username || '');
      }
    } catch (error) {
      console.error('載入用戶資料失敗:', error);
      Alert.alert('錯誤', '載入用戶資料失敗');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveUsername = async () => {
    if (!username.trim()) {
      Alert.alert('提示', '名稱不能為空');
      return;
    }

    if (username === originalUsername) {
      Alert.alert('提示', '名稱未變更');
      return;
    }

    setSaving(true);
    try {
      const userData = await AsyncStorage.getItem('@user_data');
      if (userData) {
        const parsed = JSON.parse(userData);
        parsed.username = username.trim();
        await AsyncStorage.setItem('@user_data', JSON.stringify(parsed));
        setOriginalUsername(username.trim());
        Alert.alert('成功', '名稱已更新');
      }
    } catch (error) {
      console.error('保存名稱失敗:', error);
      Alert.alert('錯誤', '保存名稱失敗');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      '確認登出',
      '登出後將清除所有本地資料，包括您的密鑰對。請確保已備份您的私鑰！',
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '確定登出',
          style: 'destructive',
          onPress: async () => {
            try {
              // 清除 AsyncStorage 中的所有用戶資料
              await AsyncStorage.removeItem('@user_data');
              await AsyncStorage.removeItem('@user_setup_complete');

              // 清除 SecureStore 中的私鑰
              await SecureStore.deleteItemAsync('user_private_key');

              Alert.alert(
                '已登出',
                '所有資料已清除',
                [
                  {
                    text: '確定',
                    onPress: () => router.replace('/login'),
                  },
                ]
              );
            } catch (error) {
              console.error('登出失敗:', error);
              Alert.alert('錯誤', '登出過程發生錯誤');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.gold} />
        <Text style={styles.loadingText}>載入中...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>個人資料設定</Text>
          <View style={styles.placeholder} />
        </View>

        {/* 修改個人名稱 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👤 個人名稱</Text>
          <TextInput
            style={styles.input}
            placeholder="請輸入您的名稱"
            placeholderTextColor={COLORS.gray}
            value={username}
            onChangeText={setUsername}
            maxLength={30}
          />
          <TouchableOpacity
            style={[styles.saveButton, saving && styles.buttonDisabled]}
            onPress={handleSaveUsername}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <Text style={styles.saveButtonText}>保存名稱</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* 密鑰資訊 */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/keyInfo')}
        >
          <View style={styles.menuItemLeft}>
            <Text style={styles.menuIcon}>🔑</Text>
            <Text style={styles.menuText}>密鑰資訊</Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        {/* 個人數據統計 */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/userStats')}
        >
          <View style={styles.menuItemLeft}>
            <Text style={styles.menuIcon}>📊</Text>
            <Text style={styles.menuText}>個人數據統計</Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        {/* 登出按鈕 */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>🚪 登出帳號</Text>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: SIZES.medium,
    color: COLORS.gray,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
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
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.black,
  },
  placeholder: {
    width: 40,
  },
  section: {
    marginBottom: 24,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: SIZES.large,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 12,
  },
  input: {
    backgroundColor: COLORS.backGround || '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: SIZES.medium,
    color: COLORS.black,
    borderWidth: 1,
    borderColor: COLORS.lightGray || '#E0E0E0',
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: COLORS.gold,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    color: COLORS.white,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  menuText: {
    fontSize: SIZES.medium,
    fontWeight: '500',
    color: COLORS.black,
  },
  menuArrow: {
    fontSize: 32,
    color: COLORS.gray,
    fontWeight: '300',
  },
  logoutButton: {
    backgroundColor: '#FF4444',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  logoutButtonText: {
    fontSize: SIZES.medium,
    fontWeight: '700',
    color: COLORS.white,
  },
});

export default ProfileSettings;
