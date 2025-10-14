import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';

/**
 * Index page - 自動重定向到 welcome 頁面
 */
const Index = () => {
  const router = useRouter();

  useEffect(() => {
    // 使用 setTimeout 確保路由器已準備好
    const timeout = setTimeout(() => {
      router.replace('welcome'); // 移除開頭的 '/'
    }, 100);

    return () => clearTimeout(timeout);
  }, [router]);

  // 顯示一個簡單的 loading 狀態
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <ActivityIndicator size="large" color="#FFD700" />
    </View>
  );
};

export default Index;
