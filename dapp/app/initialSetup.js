// 必須最先導入 crypto polyfill
import 'react-native-get-random-values';

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
import * as LocalAuthentication from 'expo-local-authentication';
import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';
import * as bip39 from 'bip39';
import { COLORS, SIZES } from '../constants';

/**
 * 初始設定頁面
 * 讓用戶輸入名稱並自動生成 Solana 密鑰對（僅首次使用）
 */
const InitialSetup = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inputMode, setInputMode] = useState('generate'); // 'generate', 'manual', or 'mnemonic'
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mnemonic, setMnemonic] = useState(''); // 助記詞

  useEffect(() => {
    if (inputMode === 'generate') {
      generateKeypair();
    } else if (inputMode === 'manual') {
      // 手動模式：清空所有欄位讓用戶輸入
      setPublicKey('');
      setPrivateKey('');
      setMnemonic('');
    } else if (inputMode === 'mnemonic') {
      // 助記詞模式：清空密鑰，等待用戶輸入助記詞
      setPublicKey('');
      setPrivateKey('');
    }
  }, [inputMode]);

  const generateKeypair = () => {
    try {
      // 生成新的 Solana 密鑰對
      const newKeypair = Keypair.generate();
      setPublicKey(newKeypair.publicKey.toBase58());
      setPrivateKey(bs58.encode(newKeypair.secretKey));
    } catch (error) {
      console.error('生成密鑰對失敗:', error);
      Alert.alert('錯誤', '生成密鑰對失敗，請重試');
    }
  };

  // 🔑 從助記詞生成密鑰對
  const generateKeypairFromMnemonic = (mnemonicPhrase) => {
    try {
      // 1. 驗證助記詞格式
      const trimmedMnemonic = mnemonicPhrase.trim().toLowerCase();
      if (!bip39.validateMnemonic(trimmedMnemonic)) {
        Alert.alert('助記詞無效', '請檢查您的助記詞是否正確');
        return;
      }

      // 2. 從助記詞生成種子
      const seed = bip39.mnemonicToSeedSync(trimmedMnemonic).slice(0, 32);

      // 3. 從種子生成密鑰對
      const keypair = Keypair.fromSeed(seed);

      // 4. 更新狀態
      setPublicKey(keypair.publicKey.toBase58());
      setPrivateKey(bs58.encode(keypair.secretKey));

      Alert.alert('成功', '已從助記詞生成密鑰對');
    } catch (error) {
      console.error('從助記詞生成密鑰對失敗:', error);
      Alert.alert('錯誤', '從助記詞生成密鑰對失敗，請重試');
    }
  };

  // 當助記詞改變時自動生成密鑰對
  useEffect(() => {
    if (inputMode === 'mnemonic' && mnemonic.trim()) {
      const words = mnemonic.trim().split(/\s+/);
      // 只在輸入完整助記詞時才自動生成（12或24個詞）
      if (words.length === 12 || words.length === 24) {
        generateKeypairFromMnemonic(mnemonic);
      }
    }
  }, [mnemonic, inputMode]);

  const validateKeypair = () => {
    try {
      // 1. 驗證公鑰格式
      if (!publicKey || publicKey.trim().length === 0) {
        Alert.alert('驗證失敗', '請輸入公鑰');
        return null;
      }

      // 檢查公鑰長度（Solana 公鑰通常是 32-44 個字符）
      if (publicKey.length < 32 || publicKey.length > 44) {
        Alert.alert(
          '驗證失敗',
          `公鑰長度不正確\n當前長度：${publicKey.length}\n正確長度應為 32-44 個字符`
        );
        return null;
      }

      // 2. 驗證私鑰格式
      if (!privateKey || privateKey.trim().length === 0) {
        Alert.alert('驗證失敗', '請輸入私鑰');
        return null;
      }

      // 3. 嘗試解碼私鑰（Base58 格式）
      let secretKeyArray;
      try {
        secretKeyArray = bs58.decode(privateKey.trim());
      } catch (decodeError) {
        Alert.alert(
          '私鑰格式錯誤',
          '私鑰必須是有效的 Base58 編碼格式\n請檢查是否包含無效字符'
        );
        return null;
      }

      // 4. 檢查私鑰長度（Solana 私鑰應該是 64 bytes）
      if (secretKeyArray.length !== 64) {
        Alert.alert(
          '私鑰長度錯誤',
          `私鑰長度必須為 64 bytes\n當前長度：${secretKeyArray.length} bytes`
        );
        return null;
      }

      // 5. 從私鑰重建 keypair
      let keypair;
      try {
        keypair = Keypair.fromSecretKey(secretKeyArray);
      } catch (keypairError) {
        Alert.alert(
          '私鑰無效',
          '無法從私鑰生成密鑰對\n請確認私鑰是否正確'
        );
        return null;
      }

      // 6. 從私鑰推導公鑰並與輸入的公鑰比對
      const derivedPublicKey = keypair.publicKey.toBase58();
      if (derivedPublicKey !== publicKey.trim()) {
        Alert.alert(
          '公私鑰不匹配',
          '私鑰導出公鑰不合輸入公鑰'
        );
        return null;
      }

      // 7. 所有驗證通過
      return keypair;
    } catch (error) {
      console.error('密鑰驗證失敗:', error);
      Alert.alert(
        '驗證失敗',
        `發生未預期的錯誤：\n${error.message || '請檢查密鑰格式是否正確'}`
      );
      return null;
    }
  };

  const handleComplete = async () => {
    // 1. 檢查用戶名稱
    if (!username.trim()) {
      Alert.alert('提示', '請輸入您的名稱');
      return;
    }

    // 2. 檢查公私鑰是否已填寫
    if (!publicKey || !privateKey) {
      Alert.alert('錯誤', '請輸入或生成密鑰對');
      return;
    }

    // 3. 修剪公私鑰的空格
    setPublicKey(publicKey.trim());
    setPrivateKey(privateKey.trim());

    // 4. 驗證密鑰對的有效性和配對
    console.log('開始驗證密鑰對...');
    const keypair = validateKeypair();
    if (!keypair) {
      console.log('密鑰對驗證失敗');
      return;
    }
    console.log('密鑰對驗證成功！');

    setLoading(true);

    try {
      // 保存用戶資訊
      const userData = {
        username: username.trim(),
        publicKey: publicKey,
        createdAt: new Date().toISOString(),
      };

      // 保存到 AsyncStorage
      await AsyncStorage.setItem('@user_data', JSON.stringify(userData));

      // 🔐 使用 SecureStore 保存私鑰（硬體級加密，100% 離線，永不上網）
      await SecureStore.setItemAsync('user_private_key', privateKey);

      // 標記已完成設定
      await AsyncStorage.setItem('@user_setup_complete', 'true');

      Alert.alert(
        '設定完成！',
        '您的帳戶已成功創建',
        [
          {
            text: '開始使用',
            onPress: () => router.replace('/home'),
          },
        ]
      );
    } catch (error) {
      console.error('保存設定失敗:', error);
      Alert.alert('錯誤', '保存設定失敗，請重試');
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
        setIsAuthenticated(true);
        Alert.alert('驗證成功', '您現在可以查看私鑰');
      } else {
        Alert.alert('驗證失敗', '請重試');
      }
    } catch (error) {
      console.error('生物識別驗證失敗:', error);
      Alert.alert('錯誤', '驗證過程發生錯誤');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>初始設定</Text>
        </View>

        {/* 用戶名稱輸入 */}
        <View style={styles.section}>
          <View style={styles.titleRow}>
            <Text style={styles.sectionTitle}>👤 您的名稱</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="請輸入您的名稱"
            placeholderTextColor={COLORS.gray}
            value={username}
            onChangeText={setUsername}
            maxLength={30}
          />
          <Text style={styles.hint}>此名稱將顯示給其他群組成員</Text>
        </View>

        {/* 模式選擇器 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔐 密鑰設定方式</Text>
          <View style={styles.modeSelector}>
            <TouchableOpacity
              style={[styles.modeButton, inputMode === 'generate' && styles.modeButtonActive]}
              onPress={() => setInputMode('generate')}
            >
              <Text style={[styles.modeButtonText, inputMode === 'generate' && styles.modeButtonTextActive]}>
                自動生成
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeButton, inputMode === 'mnemonic' && styles.modeButtonActive]}
              onPress={() => setInputMode('mnemonic')}
            >
              <Text style={[styles.modeButtonText, inputMode === 'mnemonic' && styles.modeButtonTextActive]}>
                助記詞導入
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeButton, inputMode === 'manual' && styles.modeButtonActive]}
              onPress={() => setInputMode('manual')}
            >
              <Text style={[styles.modeButtonText, inputMode === 'manual' && styles.modeButtonTextActive]}>
                手動輸入
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 助記詞輸入區域（僅在助記詞模式顯示）*/}
        {inputMode === 'mnemonic' && (
          <View style={styles.section}>
            <View style={styles.titleRow}>
              <Text style={styles.sectionTitle}>📝 助記詞</Text>
            </View>
            <TextInput
              style={[styles.input, styles.mnemonicInput]}
              placeholder="請輸入您的助記詞（12或24個單詞，以空格分隔）"
              placeholderTextColor={COLORS.gray}
              value={mnemonic}
              onChangeText={setMnemonic}
              multiline
              numberOfLines={3}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Text style={styles.hint}>
              輸入完整的助記詞後，系統會自動生成對應的密鑰對
            </Text>
            <View style={styles.infoBox}>
              <Text style={styles.infoIcon}>💡</Text>
              <Text style={styles.infoText}>
                助記詞通常由12或24個英文單詞組成，請確保單詞之間用空格分隔
              </Text>
            </View>
          </View>
        )}

        {/* 公鑰輸入/顯示 */}
        <View style={styles.section}>
          <View style={styles.titleRow}>
            <Text style={styles.sectionTitle}>🔑 公鑰（地址）</Text>
            {publicKey && (
              <TouchableOpacity
                onPress={() => copyToClipboard(publicKey, '公鑰')}
              >
                <Text style={styles.copyButtonText}>📋 複製公鑰</Text>
              </TouchableOpacity>
            )}
          </View>
          <TextInput
            style={[styles.input, styles.keyInput]}
            placeholder="請輸入或生成公鑰"
            placeholderTextColor={COLORS.gray}
            value={publicKey}
            onChangeText={setPublicKey}
            multiline
            numberOfLines={2}
            editable={inputMode === 'manual'}
          />
          <Text style={styles.hint}>
            這是您的 Solana 地址，可以分享給他人
          </Text>
        </View>

        {/* 私鑰輸入/顯示 */}
        <View style={styles.section}>
          {/* 標題列：私鑰 + 顯示/隱藏按鈕 */}
          <View style={styles.titleRow}>
            <Text style={styles.sectionTitle}>🔐 私鑰</Text>
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => {
                if (showPrivateKey) {
                  // 如果已經顯示,直接隱藏
                  setShowPrivateKey(false);
                  setIsAuthenticated(false);
                } else {
                  // 如果要顯示,需要驗證
                  authenticateToViewPrivateKey();
                }
              }}
            >
              <Text style={styles.toggleButtonText}>
                {showPrivateKey ? '👁️ 隱藏' : '🔒 驗證查看'}
              </Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={[styles.input, styles.keyInput]}
            placeholder="請輸入或生成私鑰"
            placeholderTextColor={COLORS.gray}
            value={showPrivateKey ? privateKey : '••••••••••••••••••••••••••••••••'}
            onChangeText={setPrivateKey}
            multiline
            numberOfLines={2}
            secureTextEntry={!showPrivateKey}
            editable={inputMode === 'manual'}
          />

          <View style={styles.warningBox}>
            <Text style={styles.warningIcon}>⚠️</Text>
            <Text style={styles.warningText}>
              請妥善保管私鑰，以紙筆紀錄私鑰並收藏{'\n'}
              私鑰一旦遺失將無法恢復，且任何人獲得您的私鑰都可以控制您的資產。
            </Text>
          </View>
        </View>

        {/* 重新生成按鈕（僅在自動生成模式顯示）*/}
        {inputMode === 'generate' && (
          <TouchableOpacity
            style={styles.regenerateButton}
            onPress={generateKeypair}
          >
            <Text style={styles.regenerateButtonText}>🔄 自動生成密鑰對</Text>
          </TouchableOpacity>
        )}

        {/* 完成按鈕 */}
        <TouchableOpacity
          style={[styles.completeButton, loading && styles.buttonDisabled]}
          onPress={handleComplete}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <Text style={styles.completeButtonText}>完成設定</Text>
          )}
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
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: SIZES.large,
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
    borderWidth: 2,
    borderColor: COLORS.lightGray || '#E0E0E0',
  },
  keyInput: {
    minHeight: 80,
    textAlignVertical: 'top',
    fontFamily: 'monospace',
  },
  hint: {
    fontSize: SIZES.xSmall,
    color: COLORS.gray,
    marginTop: 8,
  },
  modeSelector: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 4,
    borderWidth: 2,
    borderColor: COLORS.lightGray || '#E0E0E0',
  },
  modeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modeButtonActive: {
    backgroundColor: COLORS.gold,
  },
  modeButtonText: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    color: COLORS.gray,
  },
  modeButtonTextActive: {
    color: COLORS.white,
  },
  copyButton: {
    backgroundColor: COLORS.gold + '20',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  copyButtonText: {
    fontSize: SIZES.small,
    color: COLORS.gold,
    fontWeight: '600',
  },
  keyActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  toggleButton: {
    flex: 1,
    backgroundColor: COLORS.gold + '20',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  toggleButtonText: {
    fontSize: SIZES.small,
    color: COLORS.gold,
    fontWeight: '600',
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF3CD',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#FFE69C',
  },
  warningIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  warningText: {
    flex: 1,
    fontSize: SIZES.xSmall,
    color: '#856404',
    lineHeight: 18,
  },
  regenerateButton: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: COLORS.gold,
  },
  regenerateButtonText: {
    fontSize: SIZES.medium,
    color: COLORS.gold,
    fontWeight: '600',
  },
  completeButton: {
    backgroundColor: COLORS.yellow,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  completeButtonText: {
    fontSize: SIZES.large,
    fontWeight: '700',
    color: COLORS.white,
  },
    section: {
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  // 🔹 私鑰 + 顯示按鈕 並排
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  toggleButton: {
    marginLeft: 8, // 與「私鑰」之間留一點距離
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  toggleButtonText: {
    fontSize: 16,
    color: COLORS.primary, // 你可以換成其他顏色
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: COLORS.text,
  },
  keyInput: {
    height: 90,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.warningBg,
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  warningIcon: {
    marginRight: 8,
    fontSize: 18,
  },
  warningText: {
    flex: 1,
    color: COLORS.warningText,
    fontSize: 14,
  },
  mnemonicInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#90CAF9',
  },
  infoIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  infoText: {
    flex: 1,
    fontSize: SIZES.xSmall,
    color: '#1565C0',
    lineHeight: 18,
  },
});

export default InitialSetup;
