import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SIZES } from '../constants';

/**
 * 登入頁面
 * 簡化版：點擊開始使用按鈕直接進入初始設定頁面
 */
const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // 檢查是否已完成初始設定
  useEffect(() => {
    checkSetup();
  }, []);

  const checkSetup = async () => {
    try {
      const userSetup = await AsyncStorage.getItem('@user_setup_complete');
      if (userSetup === 'true') {
        // 已完成設定，直接進入主頁
        router.replace('/home');
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log('檢查設定失敗:', error);
      setLoading(false);
    }
  };

  const handleStartApp = () => {
    // 直接跳轉到初始設定頁面
    router.push('/initialSetup');
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
      <View style={styles.content}>
        {/* Logo 區域 */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>💰</Text>
          </View>
          <Text style={styles.appName}>Chain Split</Text>
          <Text style={styles.appTagline}>區塊鏈分帳，簡單透明</Text>
        </View>

        {/* 說明區域 */}
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>🔐</Text>
            <Text style={styles.infoText}>安全可靠的區塊鏈技術</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>👥</Text>
            <Text style={styles.infoText}>輕鬆管理群組分帳</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>💳</Text>
            <Text style={styles.infoText}>即時透明的帳款記錄</Text>
          </View>
        </View>

        {/* 登入按鈕 */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartApp}
          >
            <Text style={styles.startButtonText}>開始使用</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 版本資訊 */}
      <Text style={styles.version}>Chain Split v1.0.0</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backGround || '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 24,
    justifyContent: 'space-around',
  },
  loadingText: {
    marginTop: 16,
    fontSize: SIZES.medium,
    color: COLORS.gray,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.gold,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  logoText: {
    fontSize: 64,
  },
  appName: {
    fontSize: 36,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 8,
  },
  appTagline: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
    textAlign: 'center',
  },
  infoContainer: {
    marginVertical: 40,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  infoIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  infoText: {
    fontSize: SIZES.medium,
    color: COLORS.black,
    fontWeight: '500',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 40,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#f3cc68ff",
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 12,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginBottom: 16,
  },
  startButtonText: {
    fontSize: SIZES.large,
    fontWeight: '700',
    color: COLORS.black,
  },
  disclaimer: {
    fontSize: SIZES.xSmall,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 16,
  },
  version: {
    fontSize: SIZES.xSmall,
    color: COLORS.gray,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default Login;
