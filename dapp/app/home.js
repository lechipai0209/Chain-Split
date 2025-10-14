import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { COLORS, FONTS } from '../constants';

/**
 * 主頁面
 * 顯示歡迎訊息和按鈕
 */
const Home = () => {
  const handleWelcomePress = () => {
    // 目前不需要任何反應
    console.log('Welcome button pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chain Split</Text>
        <View style={styles.headerIconContainer}>
          <Text style={styles.headerIcon}>💰</Text>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome!</Text>
          <Text style={styles.welcomeSubtitle}>
            Ready to manage your group expenses
          </Text>
        </View>

        {/* Welcome Button */}
        <TouchableOpacity
          style={styles.welcomeButton}
          onPress={handleWelcomePress}
          activeOpacity={0.8}
        >
          <Text style={styles.welcomeButtonText}>Get Started</Text>
        </TouchableOpacity>

        {/* Info Cards */}
        <View style={styles.infoCardsContainer}>
          <View style={styles.infoCard}>
            <Text style={styles.infoCardIcon}>👥</Text>
            <Text style={styles.infoCardTitle}>Create Groups</Text>
            <Text style={styles.infoCardText}>
              Organize your friends and split expenses easily
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoCardIcon}>💳</Text>
            <Text style={styles.infoCardTitle}>Track Payments</Text>
            <Text style={styles.infoCardText}>
              Keep track of who paid and who owes
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoCardIcon}>⚡</Text>
            <Text style={styles.infoCardTitle}>Instant Settlement</Text>
            <Text style={styles.infoCardText}>
              Settle up with blockchain technology
            </Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Powered by Solana Blockchain</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray,
  },
  headerTitle: {
    fontSize: FONTS.medium,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  headerIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeTitle: {
    fontSize: FONTS.importance,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: FONTS.small,
    color: COLORS.darkgray,
    textAlign: 'center',
  },
  welcomeButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  welcomeButtonText: {
    fontSize: FONTS.regular,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  infoCardsContainer: {
    gap: 16,
  },
  infoCard: {
    backgroundColor: '#f8f8f8',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
  infoCardIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  infoCardTitle: {
    fontSize: FONTS.regular,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  infoCardText: {
    fontSize: FONTS.small,
    color: COLORS.darkgray,
    lineHeight: 20,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.gray,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.darkgray,
  },
});

export default Home;
