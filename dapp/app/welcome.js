import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, FONTS } from '../constants';

/**
 * Welcome/Loading Screen
 * 顯示應用 Logo 和加載進度條
 */
const Welcome = () => {
  const router = useRouter();
  const [progress] = useState(new Animated.Value(0));

  useEffect(() => {
    // 啟動進度條動畫
    Animated.timing(progress, {
      toValue: 1,
      duration: 2500, // 2.5秒完成加載
      useNativeDriver: false,
    }).start(() => {
      // 動畫完成後跳轉到主頁面
      setTimeout(() => {
        router.replace('home'); // 移除開頭的 '/'
      }, 300);
    });
  }, [router]);

  // 將 0-1 的進度值轉換為百分比寬度
  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      {/* Logo 區域 */}
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>💰</Text>
        </View>
        <Text style={styles.appName}>Chain Split</Text>
        <Text style={styles.appTagline}>Smart Group Payment</Text>
      </View>

      {/* 進度條區域 */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBackground}>
          <Animated.View
            style={[
              styles.progressBarFill,
              { width: progressWidth }
            ]}
          />
        </View>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 80,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    fontSize: 60,
  },
  appName: {
    fontSize: FONTS.importance,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  appTagline: {
    fontSize: FONTS.small,
    color: COLORS.darkgray,
    fontWeight: '400',
  },
  progressContainer: {
    width: '100%',
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  progressBarBackground: {
    width: '100%',
    height: 6,
    backgroundColor: COLORS.gray,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 3,
  },
  loadingText: {
    marginTop: 16,
    fontSize: FONTS.small,
    color: COLORS.darkgray,
    fontWeight: '500',
  },
});

export default Welcome;
