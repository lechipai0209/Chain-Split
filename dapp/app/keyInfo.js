import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import { COLORS, SIZES } from '../constants';

/**
 * 密鑰資訊頁面
 * 顯示公鑰和私鑰（只讀，不可編輯）
 * 私鑰需要生物識別驗證才能查看
 */
const KeyInfo = () => {
  const router = useRouter();
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadKeyData();
  }, []);

  const loadKeyData = async () => {
    try {
      // 載入公鑰
      const userData = await AsyncStorage.getItem('@user_data');
      if (userData) {
        const parsed = JSON.parse(userData);
        setPublicKey(parsed.publicKey || '');
      }

      // 載入私鑰
      const storedPrivateKey = await SecureStore.getItemAsync('user_private_key');
      if (storedPrivateKey) {
        setPrivateKey(storedPrivateKey);
      }
    } catch (error) {
      console.error('載入密鑰失敗:', error);
      Alert.alert('錯誤', '載入密鑰資料失敗');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, label) => {
    // TODO: 實際應用中使用 Clipboard API
    Alert.alert('已複製', `${label}已複製到剪貼板`);
  };

  // 🔐 生物識別驗證
  const authenticateToViewPrivateKey = async () => {
    try {
      // 檢查設備是否支持生物識別
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        Alert.alert('不支持', '您的設備不支持生物識別或密碼驗證');
        return;
      }

      // 檢查是否已註冊生物識別
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        Alert.alert(
          '未設置',
          '請先在設備設置中設定指紋、Face ID 或密碼'
        );
        return;
      }

      // 執行驗證
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: '驗證身份以查看私鑰',
        fallbackLabel: '使用密碼',
        cancelLabel: '取消',
        disableDeviceFallback: false,
      });

      if (result.success) {
        setShowPrivateKey(true);
        Alert.alert('驗證成功', '您現在可以查看私鑰');
      } else {
        Alert.alert('驗證失敗', '請重試');
      }
    } catch (error) {
      console.error('生物識別驗證失敗:', error);
      Alert.alert('錯誤', '驗證過程發生錯誤');
    }
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
          <Text style={styles.title}>密鑰資訊</Text>
          <View style={styles.placeholder} />
        </View>

        {/* 公鑰區域 */}
        <View style={styles.section}>
          <View style={styles.titleRow}>
            <Text style={styles.sectionTitle}>🔑 公鑰（地址）</Text>
            {publicKey && (
              <TouchableOpacity
                style={styles.copyButton}
                onPress={() => copyToClipboard(publicKey, '公鑰')}
              >
                <Text style={styles.copyButtonText}>📋 複製</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.keyBox}>
            <Text style={styles.keyText} selectable>
              {publicKey || '未設定'}
            </Text>
          </View>
          <Text style={styles.hint}>
            這是您的 Solana 地址，可以分享給他人
          </Text>
        </View>

        {/* 私鑰區域 */}
        <View style={styles.section}>
          <View style={styles.titleRow}>
            <Text style={styles.sectionTitle}>🔐 私鑰</Text>
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => {
                if (showPrivateKey) {
                  // 如果已經顯示，直接隱藏
                  setShowPrivateKey(false);
                } else {
                  // 如果要顯示，需要驗證
                  authenticateToViewPrivateKey();
                }
              }}
            >
              <Text style={styles.toggleButtonText}>
                {showPrivateKey ? '👁️ 隱藏' : '🔒 驗證查看'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.keyBox}>
            {showPrivateKey ? (
              <>
                <Text style={styles.keyText} selectable>
                  {privateKey || '未設定'}
                </Text>
                {privateKey && (
                  <TouchableOpacity
                    style={styles.copyButtonInline}
                    onPress={() => copyToClipboard(privateKey, '私鑰')}
                  >
                    <Text style={styles.copyButtonText}>📋 複製私鑰</Text>
                  </TouchableOpacity>
                )}
              </>
            ) : (
              <Text style={styles.keyTextHidden}>
                ••••••••••••••••••••••••••••••••
              </Text>
            )}
          </View>

          <View style={styles.warningBox}>
            <Text style={styles.warningIcon}>⚠️</Text>
            <Text style={styles.warningText}>
              請妥善保管私鑰，不要分享給任何人{'\n'}
              私鑰一旦遺失將無法恢復
            </Text>
          </View>
        </View>

        {/* 說明區域 */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>📖 密鑰說明</Text>
          <Text style={styles.infoText}>
            • 公鑰是您的區塊鏈地址，可以公開分享{'\n'}
            • 私鑰是您的數位簽名，必須保密{'\n'}
            • 密鑰對在初始設定時生成，無法修改{'\n'}
            • 如需更換密鑰，請登出後重新設定
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: SIZES.large,
    fontWeight: '600',
    color: COLORS.black,
  },
  keyBox: {
    backgroundColor: COLORS.backGround || '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.lightGray || '#E0E0E0',
  },
  keyText: {
    fontSize: SIZES.small,
    color: COLORS.black,
    fontFamily: 'monospace',
    lineHeight: 20,
  },
  keyTextHidden: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
    textAlign: 'center',
    letterSpacing: 2,
  },
  hint: {
    fontSize: SIZES.xSmall,
    color: COLORS.gray,
    marginTop: 8,
  },
  copyButton: {
    backgroundColor: COLORS.gold + '20',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  copyButtonInline: {
    backgroundColor: COLORS.gold + '20',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  copyButtonText: {
    fontSize: SIZES.small,
    color: COLORS.gold,
    fontWeight: '600',
  },
  toggleButton: {
    backgroundColor: COLORS.gold + '20',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  toggleButtonText: {
    fontSize: SIZES.small,
    color: COLORS.gold,
    fontWeight: '600',
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#FFE69C',
  },
  warningIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  warningText: {
    flex: 1,
    fontSize: SIZES.xSmall,
    color: '#856404',
    lineHeight: 18,
  },
  infoBox: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.lightGray || '#E0E0E0',
  },
  infoTitle: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 12,
  },
  infoText: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    lineHeight: 22,
  },
});

export default KeyInfo;
