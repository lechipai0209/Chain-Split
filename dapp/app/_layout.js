import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // 隱藏所有頁面的 header
      }}
    />
  );
};

export default Layout;